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
    const volunteerCollection = db.collection('volunteer_requests');

    const { action, data } = await req.json();

    let result;

    switch (action) {
      case 'fetchAll':
        result = await volunteerCollection.find({}).toArray();
        break;

      case 'create':
        const bookingData = {
          ...data,
          status: 'Scheduled',
          created_at: new Date(),
        };
        const insertResult = await volunteerCollection.insertOne(bookingData);
        result = { ...bookingData, _id: insertResult.insertedId };
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
