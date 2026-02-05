#!/usr/bin/env node

/**
 * LIVING INK: AI Breathing Video Generator
 *
 * Generates subtle breathing motion videos from static drawings
 * using Replicate's Stable Video Diffusion model.
 *
 * Usage:
 *   node scripts/generate-breathing-videos.js
 *
 * Requirements:
 *   npm install replicate dotenv
 *   REPLICATE_API_TOKEN in .env file
 */

import Replicate from 'replicate';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// =====================
// CONFIGURATION
// =====================

const CONFIG = {
  // Replicate API
  apiToken: process.env.REPLICATE_API_TOKEN,

  // Input/Output paths
  inputDir: path.join(__dirname, '..', 'assets', 'drawings'),
  outputDir: path.join(__dirname, '..', 'assets', 'videos', 'breathing'),

  // Priority drawings for breathing effect
  priorityDrawings: [
    'IMG_0159.jpg',  // Sadhu in red robes
    'IMG_0161.jpg',  // Shaolin monk stance
    'IMG_0165.jpg',  // Jimi Hendrix psychedelic
    'IMG_0154.jpg',  // Bagua I-Ching diagram
    'IMG_0160.jpg',  // Portrait study
    'IMG_0155.jpg',  // Architectural
  ],

  // Video generation settings
  svdSettings: {
    cond_aug: 0.02,              // Low = subtle motion
    decoding_t: 7,               // Frames to decode
    video_length: '14_frames_with_svd',
    sizing_strategy: 'maintain_aspect_ratio',
    motion_bucket_id: 40,        // Low = gentle breathing (1-255)
    frames_per_second: 6,        // Smooth but not hyper-realistic
  },

  // Processing options
  processAll: false,             // If true, process all drawings
  skipExisting: true,            // Skip if output file exists
  verbose: true,
};

// =====================
// REPLICATE CLIENT
// =====================

let replicate;

function initReplicate() {
  if (!CONFIG.apiToken) {
    console.error('❌ REPLICATE_API_TOKEN not found in environment');
    console.error('   Add it to your .env file:');
    console.error('   REPLICATE_API_TOKEN=r8_xxxxxxxxxxxx');
    process.exit(1);
  }

  replicate = new Replicate({
    auth: CONFIG.apiToken,
  });

  console.log('✓ Replicate client initialized');
}

// =====================
// FILE UTILITIES
// =====================

async function ensureDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error(`Failed to create directory: ${dirPath}`, error);
    return false;
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getDrawingFiles() {
  const files = await fs.readdir(CONFIG.inputDir);
  return files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));
}

function getOutputPath(inputFilename) {
  const basename = path.basename(inputFilename, path.extname(inputFilename));
  return path.join(CONFIG.outputDir, `${basename}_breathing.mp4`);
}

// =====================
// IMAGE UPLOAD
// =====================

async function uploadImageToReplicate(imagePath) {
  try {
    // Read image as base64
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const dataUri = `data:${mimeType};base64,${base64Image}`;

    return dataUri;
  } catch (error) {
    console.error(`Failed to upload image: ${imagePath}`, error);
    throw error;
  }
}

// =====================
// VIDEO GENERATION
// =====================

async function generateBreathingVideo(imagePath, outputPath) {
  const filename = path.basename(imagePath);

  console.log(`\n📹 Processing: ${filename}`);
  console.log(`   Input:  ${imagePath}`);
  console.log(`   Output: ${outputPath}`);

  try {
    // Upload image
    console.log('   ⬆️  Uploading image...');
    const imageDataUri = await uploadImageToReplicate(imagePath);

    // Generate video
    console.log('   🎬 Generating breathing video...');
    console.log('   ⏱️  This may take 2-5 minutes...');

    const output = await replicate.run(
      'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
      {
        input: {
          input_image: imageDataUri,
          ...CONFIG.svdSettings,
        }
      }
    );

    // Download video
    console.log('   ⬇️  Downloading video...');
    const videoUrl = typeof output === 'string' ? output : output[0];

    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const videoBuffer = await response.arrayBuffer();
    await fs.writeFile(outputPath, Buffer.from(videoBuffer));

    console.log(`   ✅ Success! Saved to: ${outputPath}`);
    console.log(`   📦 Size: ${(videoBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);

    return {
      success: true,
      inputPath: imagePath,
      outputPath,
      size: videoBuffer.byteLength,
    };

  } catch (error) {
    console.error(`   ❌ Failed to generate video:`, error.message);
    return {
      success: false,
      inputPath: imagePath,
      error: error.message,
    };
  }
}

// =====================
// BATCH PROCESSING
// =====================

async function processBatch(filenames) {
  const results = {
    total: filenames.length,
    success: 0,
    failed: 0,
    skipped: 0,
    details: [],
  };

  for (let i = 0; i < filenames.length; i++) {
    const filename = filenames[i];
    const inputPath = path.join(CONFIG.inputDir, filename);
    const outputPath = getOutputPath(filename);

    console.log(`\n[${ i + 1 }/${ filenames.length }]`);

    // Check if output already exists
    if (CONFIG.skipExisting && await fileExists(outputPath)) {
      console.log(`⏭️  Skipping: ${filename} (already exists)`);
      results.skipped++;
      continue;
    }

    // Generate video
    const result = await generateBreathingVideo(inputPath, outputPath);
    results.details.push(result);

    if (result.success) {
      results.success++;
    } else {
      results.failed++;
    }

    // Rate limiting - wait between requests
    if (i < filenames.length - 1) {
      console.log('   ⏸️  Waiting 5 seconds before next request...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  return results;
}

// =====================
// SUMMARY REPORT
// =====================

function printSummary(results) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 GENERATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total:    ${results.total}`);
  console.log(`✅ Success: ${results.success}`);
  console.log(`❌ Failed:  ${results.failed}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);

  if (results.success > 0) {
    const totalSize = results.details
      .filter(r => r.success)
      .reduce((sum, r) => sum + r.size, 0);

    console.log(`📦 Total:   ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  }

  if (results.failed > 0) {
    console.log('\n❌ Failed files:');
    results.details
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${path.basename(r.inputPath)}: ${r.error}`);
      });
  }

  console.log('='.repeat(60) + '\n');
}

// =====================
// MAIN
// =====================

async function main() {
  console.log('🖋️  LIVING INK: AI Breathing Video Generator\n');

  // Initialize
  initReplicate();

  // Ensure output directory exists
  await ensureDirectory(CONFIG.outputDir);

  // Determine which files to process
  let filesToProcess;

  if (CONFIG.processAll) {
    console.log('📂 Processing ALL drawings...\n');
    filesToProcess = await getDrawingFiles();
  } else {
    console.log('📂 Processing PRIORITY drawings...\n');
    filesToProcess = CONFIG.priorityDrawings;
  }

  console.log(`📋 Files to process: ${filesToProcess.length}`);
  filesToProcess.forEach((f, i) => {
    console.log(`   ${i + 1}. ${f}`);
  });

  // Confirm before starting
  if (filesToProcess.length === 0) {
    console.log('\n❌ No files to process. Exiting.');
    return;
  }

  console.log('\n⚡ Starting generation...');

  // Process batch
  const results = await processBatch(filesToProcess);

  // Print summary
  printSummary(results);

  // Next steps
  console.log('📝 Next Steps:');
  console.log('   1. Review generated videos in:', CONFIG.outputDir);
  console.log('   2. Update HTML with data-video-src attributes');
  console.log('   3. Test in browser: living-ink-demo.html\n');
}

// =====================
// RUN
// =====================

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
