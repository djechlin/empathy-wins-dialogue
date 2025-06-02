import { describe, it, expect } from 'vitest'
import { generateRealtimeReport } from '../src/lib/generateRealtimeReport'

describe('generateRealtimeReport E2E', () => {
  it('should successfully call supabase function and return data', async () => {
    const testTranscript = `
      Canvasser: Hi, I'm calling about healthcare. Can you tell me about someone close to you?
      Voter: Well, my mom has been struggling with her medications being so expensive.
      Canvasser: That sounds really difficult. Can you tell me more about your mom?
      Voter: She's 72 and raised me as a single parent. She's always been there for me.
    `

    // This test calls the real Supabase function
    // It should pass if we get a 200 response, fail otherwise
    const result = await generateRealtimeReport(testTranscript, 'framing');

    console.log('Result object returned from generateRealtimeReport:');
    console.log(JSON.stringify(result, null, 2));

    expect(result).toBeDefined();
  }, 30000) // 30 second timeout for API call
})