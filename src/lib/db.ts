import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

const dbName = "slp";
const collectionName = "registrations";

async function getCollection() {
  await client.connect();
  const db = client.db(dbName);
  return db.collection(collectionName);
}

// ✅ SAVE
export async function saveRegistration(data: any) {
  const col = await getCollection();
  await col.insertOne(data);
}

// ✅ GET
export async function getRegistrationByRef(ref: string) {
  const col = await getCollection();
  return await col.findOne({ reference: ref });
}

// ✅ UPDATE
export async function updateRegistrationStatus(ref: string, status: string) {
  const col = await getCollection();
  await col.updateOne(
    { reference: ref },
    { $set: { status } }
  );
}