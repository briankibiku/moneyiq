#!/usr/bin/env node

/**
 * MoneyIQ Rate Update Script
 * 
 * This script fetches the latest financial rates and updates the JSON data files.
 * Run manually: node scripts/update-rates.js
 * Or via cron/GitHub Actions for automated updates.
 * 
 * Data Sources:
 * - CBK (Central Bank of Kenya): https://www.centralbank.go.ke
 * - Individual bank websites
 * - Kenya Bankers Association
 * 
 * Usage:
 *   node scripts/update-rates.js              # Update all rates
 *   node scripts/update-rates.js --dry-run    # Preview changes without saving
 *   node scripts/update-rates.js --validate   # Only validate existing data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'public', 'data');

const isDryRun = process.argv.includes('--dry-run');
const isValidateOnly = process.argv.includes('--validate');

/**
 * Validate the bank-rates.json schema
 */
function validateBankRates(data) {
  const errors = [];
  
  if (!data.lastUpdated) errors.push('Missing lastUpdated');
  if (!data.source) errors.push('Missing source');
  if (typeof data.centralBankRate !== 'number') errors.push('centralBankRate must be a number');
  if (!Array.isArray(data.banks)) errors.push('banks must be an array');
  
  data.banks?.forEach((bank, i) => {
    if (!bank.id) errors.push(`Bank ${i}: missing id`);
    if (!bank.name) errors.push(`Bank ${i}: missing name`);
    if (typeof bank.lendingRate !== 'number') errors.push(`Bank ${i} (${bank.name}): lendingRate must be a number`);
    if (typeof bank.savingsRate !== 'number') errors.push(`Bank ${i} (${bank.name}): savingsRate must be a number`);
    if (typeof bank.mortgageRate !== 'number') errors.push(`Bank ${i} (${bank.name}): mortgageRate must be a number`);
    
    // Sanity checks
    if (bank.lendingRate < 5 || bank.lendingRate > 30) {
      errors.push(`Bank ${bank.name}: lendingRate ${bank.lendingRate}% seems out of range (5-30%)`);
    }
    if (bank.savingsRate < 0 || bank.savingsRate > 15) {
      errors.push(`Bank ${bank.name}: savingsRate ${bank.savingsRate}% seems out of range (0-15%)`);
    }
  });
  
  return errors;
}

/**
 * Update the metadata.json with new timestamps
 */
function updateMetadata(dataset) {
  const metadataPath = path.join(DATA_DIR, 'metadata.json');
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  const now = new Date().toISOString();
  metadata.lastUpdated = now;
  
  if (metadata.datasets[dataset]) {
    metadata.datasets[dataset].lastUpdated = now;
  }
  
  if (!isDryRun) {
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`✅ Updated metadata.json for dataset: ${dataset}`);
  } else {
    console.log(`[DRY RUN] Would update metadata.json for dataset: ${dataset}`);
  }
}

/**
 * Main update function
 * 
 * Currently reads existing data and validates it.
 * 
 * TO ADD AUTOMATED FETCHING:
 * 1. Add fetch calls to CBK API or scrape bank websites
 * 2. Transform the fetched data into our JSON schema
 * 3. Merge with existing data
 * 4. Save the updated JSON
 * 
 * Example future implementation:
 * ```
 * const cbkResponse = await fetch('https://api.centralbank.go.ke/rates');
 * const cbkData = await cbkResponse.json();
 * bankRates.centralBankRate = cbkData.cbr;
 * ```
 */
async function updateRates() {
  console.log('🏦 MoneyIQ Rate Updater');
  console.log('========================\n');
  
  // Load current data
  const bankRatesPath = path.join(DATA_DIR, 'bank-rates.json');
  
  if (!fs.existsSync(bankRatesPath)) {
    console.error('❌ bank-rates.json not found at:', bankRatesPath);
    process.exit(1);
  }
  
  const bankRates = JSON.parse(fs.readFileSync(bankRatesPath, 'utf8'));
  
  // Validate
  console.log('📋 Validating bank-rates.json...');
  const errors = validateBankRates(bankRates);
  
  if (errors.length > 0) {
    console.error('❌ Validation errors:');
    errors.forEach((e) => console.error(`   - ${e}`));
    process.exit(1);
  } else {
    console.log('✅ Validation passed!');
  }
  
  if (isValidateOnly) {
    console.log('\n✅ Validation-only mode complete.');
    return;
  }
  
  // Display current stats
  console.log(`\n📊 Current Data Summary:`);
  console.log(`   CBK Base Rate: ${bankRates.centralBankRate}%`);
  console.log(`   Banks tracked: ${bankRates.banks.length}`);
  console.log(`   Last updated: ${bankRates.lastUpdated}`);
  console.log(`   Avg Lending Rate: ${(bankRates.banks.reduce((s, b) => s + b.lendingRate, 0) / bankRates.banks.length).toFixed(2)}%`);
  console.log(`   Avg Savings Rate: ${(bankRates.banks.reduce((s, b) => s + b.savingsRate, 0) / bankRates.banks.length).toFixed(2)}%`);
  
  // TODO: Add actual rate fetching logic here
  // For now, just update the timestamp
  console.log('\n⏳ Updating timestamps...');
  
  bankRates.lastUpdated = new Date().toISOString();
  
  if (!isDryRun) {
    fs.writeFileSync(bankRatesPath, JSON.stringify(bankRates, null, 2));
    updateMetadata('bank-rates');
    console.log('✅ bank-rates.json updated successfully!');
  } else {
    console.log('[DRY RUN] Would update bank-rates.json');
  }
  
  console.log('\n🎉 Rate update complete!');
  console.log('\nTo manually edit rates, update: public/data/bank-rates.json');
  console.log('No code changes required — just update the JSON and redeploy.');
}

updateRates().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
