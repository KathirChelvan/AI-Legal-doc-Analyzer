import requests
import json

def analyze_legal_document(text):
    """Analyze legal document using local LLM via LM Studio"""
    
    # Truncate text if too long (keep first 4000 characters)
    if len(text) > 4000:
        text = text[:4000] + "...\n[Document truncated for analysis]"
    
    prompt = f"""You are a legal expert AI assistant. Analyze the following legal document and provide:

1. **Document Summary**: Brief overview of what this document is about
2. **Key Terms**: Important legal terms and clauses identified
3. **Potential Risks**: Any concerning clauses or terms that need attention
4. **Recommendations**: Suggested actions or points to review with a lawyer

Document to analyze:
---
{text}
---

Please provide a clear, structured analysis:"""

    try:
        response = requests.post(
            "http://localhost:1234/v1/completions",
            headers={"Content-Type": "application/json"},
            json={
                "prompt": prompt,
                "max_tokens": 800,
                "temperature": 0.3,
                "stop": ["---", "Document to analyze:"]
            },
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get("choices", [{}])[0].get("text", "No analysis generated.").strip()
        else:
            return f"Error: LLM server returned status {response.status_code}. Make sure LM Studio is running on port 1234."
    
    except requests.exceptions.ConnectionError:
        return "Error: Cannot connect to LM Studio. Please make sure LM Studio is running on port 1234 with a model loaded."
    except requests.exceptions.Timeout:
        return "Error: LLM request timed out. The document might be too long."
    except Exception as e:
        return f"Error analyzing document: {str(e)}"