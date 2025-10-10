import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient, ObjectId } from "npm:mongodb@6";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const mongoUri = Deno.env.get('MONGODB_URI');
    if (!mongoUri) {
      throw new Error('MONGODB_URI not configured');
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db('donation-platform');
    const ngosCollection = db.collection('ngos');

    const { action, data } = await req.json();

    let result;

    switch (action) {
      case 'fetchAll':
        result = await ngosCollection.find({}).sort({ created_at: -1 }).toArray();
        break;

      case 'fetchApproved':
        result = await ngosCollection.find({ status: 'Approved' }).toArray();
        break;

      case 'create':
        const ngoData = {
          ...data,
          status: 'Pending',
          created_at: new Date(),
          updated_at: new Date(),
        };
        const insertResult = await ngosCollection.insertOne(ngoData);
        result = { ...ngoData, _id: insertResult.insertedId };
        break;

      case 'updateStatus':
        const updateData: any = {
          status: data.status,
          updated_at: new Date(),
        };
        if (data.rejection_reason) {
          updateData.rejection_reason = data.rejection_reason;
        }
        await ngosCollection.updateOne(
          { _id: new ObjectId(data.id) },
          { $set: updateData }
        );
        result = { success: true };
        break;

      case 'update':
        await ngosCollection.updateOne(
          { _id: new ObjectId(data.id) },
          { 
            $set: {
              ...data.updates,
              updated_at: new Date()
            }
          }
        );
        result = { success: true };
        break;

      default:
        throw new Error('Invalid action');
    }

    await client.close();

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
