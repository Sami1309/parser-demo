import OpenAI from 'openai';
const openai = new OpenAI();

export async function sendToLLM(fileBuffers) {
  const prompt = `
You are an insurance-application extraction bot.  
Return a JSON object with these keys:
- business_info
- property_info
- coverage_requirements
<documents>
${fileBuffers.map(b => b.toString('utf8')).join('\n\n---\n\n')}
`;

  const { choices } = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(choices[0].message.content);
}
