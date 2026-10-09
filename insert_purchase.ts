import sql, { initDb } from './src/lib/db';

async function main() {
  try {
    await initDb();
    if (!sql) throw new Error("SQL is null");
    
    const buyerId = '0xC1d3007A33d86Fd7390B087304AD3083FC87438C';
    const datasetId = 'Instagram (Tier D)';
    const transactionHash = '0xb80b3f32e7d16559cc172845ff02ac1d2641a959ee71aef83917595c8043da77';
    const sizeBytes = 1048576; // 1 MB mock

    await sql`
      INSERT INTO purchases (buyer_id, dataset_id, transaction_hash, format, size_bytes)
      VALUES (${buyerId}, ${datasetId}, ${transactionHash}, 'JSONL, CSV', ${sizeBytes})
      ON CONFLICT DO NOTHING
    `;
    console.log('Inserted purchase successfully!');
    process.exit(0);
  } catch(e) {
    console.error(e);
  }
}
main();
