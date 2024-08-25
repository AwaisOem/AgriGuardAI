import { getAccessToken } from '@/lib/tokenManager';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
     
        const {prompt} = await request.json();
        if (!prompt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const response = await generateChat(prompt)
        const generatedJSON = response.results[0].generated_text
        return NextResponse.json(generatedJSON, { status: 200 });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error?.message);
        return NextResponse.json({ error: 'Error from Server' }, { status: 500 });
    }
}


const generateChat= async (prompt) => {
	const url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
    const access_token = await getAccessToken()
	const headers = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": `Bearer ${access_token}`
	};
	const body = {
		input: `You are an assistant specializing in farming and crop-related questions. Provide accurate and helpful responses about crops, farming activities, and related topics. If the question is irrelevant to farming then respond with "I don’t know". Keep answers brief, within 100 words and in one sentence.\n\nInput: how can i start growing more crops, i used to grow Coffee and Rice, give me suggestions\nOutput: Select crops that are suitable for your local climate and soil conditions. Research and choose crops that thrive in your area, Before planting, plan your garden layout, taking into account the size of each plant, their spacing, and sunlight requirements.\n\nInput: who is president of america?\nOutput: i don'\''t know\n\nInput:${prompt}\nOutput:`,
		parameters: {
			// decoding_method: "sample",
			decoding_method: "greedy",
			max_new_tokens: 200,
			min_new_tokens: 0,
			// random_seed: null,
			stop_sequences: [
				"\n\n"
			],
			// temperature: 0.45,
			// top_k: 17,
			// top_p: 1,
			repetition_penalty: 1
		},
		model_id: "ibm/granite-13b-chat-v2",
		project_id: "992d33f7-3462-4d4b-9104-72baa54c903b",
		moderations: {
			hap: {
				input: {
					enabled: true,
					threshold: 0.5,
					mask: {
						remove_entity_value: true
					}
				},
				output: {
					enabled: true,
					threshold: 0.5,
					mask: {
						remove_entity_value: true
					}
				}
			}
		}
	};

	const response = await fetch(url, {
		headers,
		method: "POST",
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		throw new Error("Non-200 response");
	}

	return await response.json();
}