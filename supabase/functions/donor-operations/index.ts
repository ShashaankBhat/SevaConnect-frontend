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
    const donorsCollection = db.collection('donors');

    const { action, data } = await req.json();

    let result;

    switch (action) {
      case 'fetchAll':
        result = await donorsCollection.find({}).toArray();
        break;

      case 'create':
        const donorData = {
          ...data,
          donation_count: 0,
          volunteer_hours: 0,
          is_flagged: false,
          created_at: new Date(),
          updated_at: new Date(),
        };
        const insertResult = await donorsCollection.insertOne(donorData);
        result = { ...donorData, _id: insertResult.insertedId };
        break;

      case 'update':
        await donorsCollection.updateOne(
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
