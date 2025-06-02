import { describe, it, expect } from 'vitest'
import { generateRealtimeReport } from '../src/lib/generateRealtimeReport'

describe('generateRealtimeReport E2E', () => {
  it('should successfully call supabase function and return data (smoke test)', async () => {
    const fullTranscript = `
      Canvasser: Hi, I'm calling about healthcare. Can you tell me about someone close to you?
      Voter: Well, my mom has been struggling with her medications being so expensive.
      Canvasser: That sounds really difficult. Can you tell me more about your mom?
      Voter: She's 72 and raised me as a single parent. She's always been there for me.
    `

    const newMessages = `
      Canvasser: That sounds really difficult. Can you tell me more about your mom?
      Voter: She's 72 and raised me as a single parent. She's always been there for me.
    `

    // This test calls the real Supabase function
    // It should pass if we get a 200 response, fail otherwise
    const result = await generateRealtimeReport(fullTranscript, newMessages, 'framing');

    console.log('Smoke test result:');
    console.log(JSON.stringify(result, null, 2));

    expect(result).toBeDefined();
  }, 30000) // 30 second timeout for API call

  it('should handle full conversation flow with all feedback criteria', async () => {
    // Comprehensive test that moves through framing -> listening -> exploring
    // and hits all feedback IDs
    
    const fullConversation = `
Canvasser: Hi there, my name is Sarah and I'm calling about healthcare so everyone can see a doctor when they need to.

Voter: Oh, okay. What's this about exactly?

Canvasser: I wanted to talk about making sure healthcare is affordable for everyone. Can you tell me about someone close to you who matters to you?

Voter: Well, my dad is really important to me. He's getting older and has some health issues.

Canvasser: That sounds like he means a lot to you. Can you tell me more about what makes your dad special to you?

Voter: He taught me everything I know about working hard. He worked two jobs to support our family when I was growing up.

Canvasser: That's beautiful. My own mom did something similar - she worked nights as a nurse while raising me and my brother. I remember one time when I was sick with pneumonia, she stayed up all night taking care of me even though she had to work the next day. How do you think healthcare costs affect your dad now?

Voter: It's really hard for him. His medications are so expensive, and he sometimes skips doses to make them last longer.

Canvasser: That must be really scary for you, knowing he's having to make those choices. It sounds like you really care about making sure he can get the care he needs, just like he took care of your family all those years.

Voter: Yeah, exactly. I worry about him all the time. I wish there was something I could do to help make healthcare more affordable for people like him.
    `

    // Test framing phase
    const framingMessages = `
Canvasser: Hi there, my name is Sarah and I'm calling about healthcare so everyone can see a doctor when they need to.

Voter: Oh, okay. What's this about exactly?
    `
    
    console.log('Testing framing phase...');
    const framingResult = await generateRealtimeReport(framingMessages, framingMessages, 'framing');
    console.log('Framing result:', framingResult);

    // Test listening phase
    const listeningMessages = `
Canvasser: I wanted to talk about making sure healthcare is affordable for everyone. Can you tell me about someone close to you who matters to you?

Voter: Well, my dad is really important to me. He's getting older and has some health issues.

Canvasser: That sounds like he means a lot to you. Can you tell me more about what makes your dad special to you?

Voter: He taught me everything I know about working hard. He worked two jobs to support our family when I was growing up.

Canvasser: That's beautiful. My own mom did something similar - she worked nights as a nurse while raising me and my brother. I remember one time when I was sick with pneumonia, she stayed up all night taking care of me even though she had to work the next day. How do you think healthcare costs affect your dad now?

Voter: It's really hard for him. His medications are so expensive, and he sometimes skips doses to make them last longer.
    `

    console.log('Testing listening phase...');
    const listeningResult = await generateRealtimeReport(fullConversation, listeningMessages, 'listening');
    console.log('Listening result:', listeningResult);

    // Test exploring phase
    const exploringMessages = `
Canvasser: That must be really scary for you, knowing he's having to make those choices. It sounds like you really care about making sure he can get the care he needs, just like he took care of your family all those years.

Voter: Yeah, exactly. I worry about him all the time. I wish there was something I could do to help make healthcare more affordable for people like him.
    `

    console.log('Testing exploring phase...');
    const exploringResult = await generateRealtimeReport(fullConversation, exploringMessages, 'exploring');
    console.log('Exploring result:', exploringResult);

    // All results should be defined
    expect(framingResult).toBeDefined();
    expect(listeningResult).toBeDefined();
    expect(exploringResult).toBeDefined();

    // Each should contain JSON feedback
    expect(framingResult).toContain('<json>');
    expect(listeningResult).toContain('<json>');
    expect(exploringResult).toContain('<json>');

  }, 60000) // 60 second timeout for comprehensive test
})