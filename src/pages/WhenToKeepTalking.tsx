import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const WhenToKeepTalking = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto">
            <Link to="/learn">
              <Button variant="ghost" className="mb-6 flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Learning Paths
              </Button>
            </Link>
            
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-50">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-dialogue-darkblue">
                  When to Keep Talking
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Learn to recognize moments for deeper conversation and when to transition topics.
              </p>
            </div>

            <div className="space-y-8">
              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Wrong Person Answers</CardTitle>
                  <CardDescription>
                    What to do when you reach someone who isn't your target voter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Sometimes a spouse, roommate, or family member answers instead of your intended contact. 
                      Don't assume this is a problem - keep going like normal! Often the "wrong" person becomes 
                      your best conversation.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded p-4">
                      <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">✅ Default Approach: Keep Going!</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        "Hi! I was actually calling for [Name], but since you're here, I'd love to get your thoughts. 
                        I'm calling about [issue]. On a scale of 1-10, how do you feel about [specific question]?"
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Why This Works:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• They're often more relaxed since they weren't expecting the call</li>
                          <li>• They may have different perspectives than your target contact</li>
                          <li>• They can share insights about the household's views</li>
                          <li>• They might become advocates within their own family</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Try the Full Process:</h4>
                        <p className="text-sm text-muted-foreground">
                          Get their 1-10 rating, ask about their reasoning, share your story, ask about people 
                          in their life. Treat them exactly like you would your original target - they deserve 
                          the same quality conversation.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">When to Pivot:</h4>
                        <p className="text-sm text-muted-foreground">
                          Only ask for your original contact if this person seems genuinely uninterested or 
                          explicitly says they're not the right person to talk to about this topic.
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded p-4">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Remember:</strong> Every person who answers has their own story and perspective. 
                        Don't treat them as a gatekeeper - treat them as a voter worth talking to.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>They're in the Middle of Something</CardTitle>
                  <CardDescription>
                    Respecting busy moments while keeping the door open
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Life happens. People are cooking dinner, helping kids with homework, or dealing with work calls. 
                      But if they're still talking to you, they're choosing to engage despite being busy.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded p-4">
                      <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">🚪 Golden Rule: If the door is open, they're still in the conversation with you</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        People who are truly too busy will say "I can't talk right now" and end the call or close the door. 
                        If they're still standing there talking, even while doing other things, continue the conversation.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Signs They're Still Engaged:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• They mention what they're doing but keep talking</li>
                          <li>• They answer your questions while multitasking</li>
                          <li>• They're standing in the doorway, not backing away</li>
                          <li>• They say "I'm busy BUT..." and continue</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">How to Proceed:</h4>
                        <p className="text-sm text-muted-foreground">
                          Acknowledge their situation briefly: "I can see you're in the middle of things. 
                          Let me ask you just one quick question about [issue]..." Then continue with your 1-10 scale.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">When They're Actually Done:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• They say "I really have to go" and step back</li>
                          <li>• They start closing the door or moving away</li>
                          <li>• They stop responding to your questions</li>
                          <li>• They give very short, distracted answers</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded p-4">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Remember:</strong> Many of the best deep canvassing conversations happen with people 
                        who are doing dishes, folding laundry, or walking their dog. Multitasking doesn't mean disinterest.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>They Say Come Back Later</CardTitle>
                  <CardDescription>
                    Turning deferrals into future opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      "Come back later" can mean anything from genuine interest to polite dismissal. 
                      The key is reading the signal and responding appropriately.
                    </p>
                    <div className="space-y-3">
                      <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/10">
                        <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Genuine Interest Signs:</h4>
                        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                          <li>• They suggest a specific time</li>
                          <li>• They ask what it's about</li>
                          <li>• They explain why now isn't good</li>
                          <li>• They seem apologetic about timing</li>
                        </ul>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                          <strong>Response:</strong> "That works perfectly! I'll try you [specific time]. 
                          It's about [brief issue]. Looking forward to hearing your thoughts."
                        </p>
                      </div>
                      <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/10">
                        <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">Polite Dismissal Signs:</h4>
                        <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                          <li>• Vague "maybe later"</li>
                          <li>• Short, clipped responses</li>
                          <li>• No follow-up questions</li>
                          <li>• Already moving away</li>
                        </ul>
                        <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                          <strong>Response:</strong> "No problem at all! Have a great day." 
                          Respect the boundary and move on.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>They're a 10</CardTitle>
                  <CardDescription>
                    Engaging with strong supporters without wasting time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      When someone rates their support as 9 or 10, they're already convinced. 
                      Your conversation should focus on activation, not persuasion.
                    </p>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Confirm and Celebrate:</h4>
                        <p className="text-sm text-muted-foreground">
                          "That's wonderful! What makes this issue so important to you?" 
                          Let them share their passion and reinforce their commitment.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Focus on Action:</h4>
                        <p className="text-sm text-muted-foreground">
                          "Since you feel so strongly, would you be interested in [volunteering/voting information/sharing with friends]?" 
                          Channel their enthusiasm into concrete steps.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Learn Their Story:</h4>
                        <p className="text-sm text-muted-foreground">
                          "Your story might really resonate with other voters. Would you mind sharing what brought you to feel so strongly?" 
                          Collect powerful testimonials.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>They're a 1</CardTitle>
                  <CardDescription>
                    Approaching strong opposition with curiosity, not conversion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Someone rating 1-2 is strongly opposed. Your goal isn't to flip them to a 10, 
                      but to understand their perspective and maybe create a small crack of doubt.
                    </p>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Lead with Curiosity:</h4>
                        <p className="text-sm text-muted-foreground">
                          "I'd love to understand your perspective. What concerns you most about this issue?" 
                          Show genuine interest in their reasoning.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Find Common Ground:</h4>
                        <p className="text-sm text-muted-foreground">
                          Look for shared values like family, fairness, or safety. "It sounds like you really care about 
                          [shared value]. I do too." Build connection before addressing differences.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Plant Small Seeds:</h4>
                        <p className="text-sm text-muted-foreground">
                          "Have you ever known someone who...?" Share brief stories that might introduce 
                          new perspectives without being confrontational.
                        </p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded p-4">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        <strong>Success metric:</strong> Moving from 1 to 2 or 3 is a huge win. 
                        Don't aim for complete conversion - aim for thoughtful reconsideration.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>They Use an Offensive Word</CardTitle>
                  <CardDescription>
                    Responding to problematic language while maintaining dialogue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Sometimes voters use language that's offensive, discriminatory, or hurtful. 
                      How you respond can either shut down the conversation or create a teaching moment.
                    </p>
                    <div className="space-y-3">
                      <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10">
                        <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">If it's clearly malicious:</h4>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          "I don't think we're going to have a productive conversation. Have a good day." 
                          Some conversations aren't worth having.
                        </p>
                      </div>
                      <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/10">
                        <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">If it seems unconscious/habitual:</h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          "I hear you're concerned about [issue]. Can you help me understand what you mean by that?" 
                          Redirect to the underlying concern without repeating the offensive language.
                        </p>
                      </div>
                      <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10">
                        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">If you can address it gently:</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          "I know you probably don't mean any harm, but that word can be really hurtful to people I care about. 
                          Can we talk about your concerns in a different way?"
                        </p>
                      </div>
                    </div>
                    <div className="bg-dialogue-neutral p-4 rounded-md border-l-4 border-dialogue-purple">
                      <p className="font-semibold">Remember:</p>
                      <p className="text-muted-foreground">
                        Your safety and well-being come first. If a conversation becomes hostile or abusive, 
                        it's always okay to end it politely and move on.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Finding Unlikely Alliances</CardTitle>
                  <CardDescription>
                    Discovering unexpected common ground with unlikely supporters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Sometimes your strongest allies come from unexpected places. Learning to recognize 
                      and nurture these surprising connections can be incredibly powerful for your cause.
                    </p>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Listen for Shared Values:</h4>
                        <p className="text-sm text-muted-foreground">
                          A conservative voter concerned about government overreach might support criminal justice reform. 
                          A liberal worried about corporate power might agree on small business protections.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Look Beyond Party Labels:</h4>
                        <p className="text-sm text-muted-foreground">
                          "I know we might disagree on some things, but it sounds like we both care about [shared concern]. 
                          What if there was a way to address that regardless of politics?"
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Personal Trumps Political:</h4>
                        <p className="text-sm text-muted-foreground">
                          Personal experiences often override political ideology. A voter who's "against welfare" 
                          might support help for families if their own loved one needed assistance.
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded p-4">
                      <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">💡 Pro Tip</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        When you find unexpected common ground, acknowledge it explicitly: "You know, 
                        I really didn't expect us to agree on this, but it sounds like we both..." 
                        This creates a powerful moment of connection.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Reading Conversation Signals</CardTitle>
                  <CardDescription>
                    Understanding when to go deeper vs. when to wrap up
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Deep canvassing conversations can last 10-20 minutes, but knowing when to continue 
                      and when to conclude is crucial. The goal is meaningful dialogue, not forced interaction.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded p-4">
                        <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">✅ Green Lights: Keep Going</h4>
                        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                          <li>• They ask you questions back</li>
                          <li>• They share personal stories</li>
                          <li>• Their tone becomes more conversational</li>
                          <li>• They pause to think before responding</li>
                          <li>• They say "I never thought about it that way"</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded p-4">
                        <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">🛑 Red Lights: Time to Wrap Up</h4>
                        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                          <li>• Short, clipped responses</li>
                          <li>• Repeatedly checking the time</li>
                          <li>• Defensive or hostile tone</li>
                          <li>• "I really need to go" signals</li>
                          <li>• Complete topic changes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>The 1-10 Scale as a Guide</CardTitle>
                  <CardDescription>
                    Using voter responses to gauge conversation depth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      In deep canvassing, we ask voters to rate their support on a 1-10 scale. Their initial 
                      response and how they explain it can guide your conversation strategy.
                    </p>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Scores 1-3: Strong Opposition</h4>
                        <p className="text-sm text-muted-foreground">
                          <strong>Strategy:</strong> Focus on understanding their concerns. Ask about personal experiences. 
                          Don't try to flip them completely - aim for small movement or mutual understanding.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Scores 4-6: Persuadable Middle</h4>
                        <p className="text-sm text-muted-foreground">
                          <strong>Strategy:</strong> These are your best candidates for meaningful movement. 
                          Explore their ambivalence. Share your story. Listen for what might shift their perspective.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-dialogue-darkblue mb-2">Scores 7-10: Strong Support</h4>
                        <p className="text-sm text-muted-foreground">
                          <strong>Strategy:</strong> Reinforce their position with stories. Help them think about 
                          how to talk to others. Focus on motivation and turnout rather than persuasion.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Transition Moments</CardTitle>
                  <CardDescription>
                    Key points where conversations can go deeper or conclude
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10">
                        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">After Sharing Your Story</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Watch for:</strong> Do they respond with their own story? Do they ask follow-up questions? 
                          This is often where surface-level chat becomes meaningful dialogue.
                        </p>
                      </div>
                      <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/10">
                        <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">When They Share Something Personal</h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          <strong>Keep going if:</strong> They're opening up about family, work, or personal experiences. 
                          This is prime time for empathetic listening and deeper connection.
                        </p>
                      </div>
                      <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/10">
                        <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">The "I Never Thought About..." Moment</h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          <strong>Golden opportunity:</strong> When they express genuine curiosity or admit to reconsidering, 
                          this is when real persuasion happens. Give them space to process.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dialogue-neutral">
                <CardHeader>
                  <CardTitle>Graceful Exits</CardTitle>
                  <CardDescription>
                    How to end conversations positively, regardless of outcome
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Not every conversation will result in deep dialogue, and that's okay. The goal is to leave 
                      every voter feeling heard and respected, even if you disagree.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-dialogue-darkblue mb-2">When Time is Limited:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• "I really appreciate you taking the time to talk"</li>
                          <li>• "Thank you for sharing your perspective"</li>
                          <li>• "I hope you have a great rest of your day"</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-dialogue-darkblue mb-2">When Views Remain Different:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• "I understand we see this differently"</li>
                          <li>• "I'm glad we could have this conversation"</li>
                          <li>• "Thanks for helping me understand your view"</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-dialogue-neutral p-4 rounded-md border-l-4 border-dialogue-purple">
                      <p className="font-semibold">Remember:</p>
                      <p className="text-muted-foreground">
                        A respectful, brief conversation is better than a forced, lengthy one. Quality over quantity - 
                        one meaningful exchange can have more impact than several surface-level interactions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WhenToKeepTalking;