import sys
import re

file_path = "d:/sales-XAM-/backend/services/sales_ai_engine.py"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the import
content = re.sub(
    r"from services\.strategy_selector import strategy_selector",
    r"from services.persuasion_engine import persuasion_engine",
    content
)

# Replace the block 1 (Strategy selection)
pattern1 = r"# 2\. Select Strategy.*?print\(\"\[AI_PIPELINE\] No specific playbook strategy matched\.\"\)"
replacement1 = """# 2. Select Strategy
            selected_strategy_name = persuasion_engine.select_strategy(topic)
            strategy_name = selected_strategy_name
            strategy_context = f\"\"\"
    A preferred persuasion strategy has been suggested: {selected_strategy_name}.
    Use this strategy if it fits the conversation, but you may adapt or choose a better approach if needed.
    Avoid repeating the same persuasion technique.
    \"\"\"
            print(f"[AI_PIPELINE] Persuasion strategy selected: {selected_strategy_name}")"""
content = re.sub(pattern1, replacement1, content, flags=re.DOTALL)


# Replace JSON schema
pattern2 = r'            - "topic": "\{topic\}"\s*- "strategy_used": "\{strategy_name\}"'
replacement2 = """            - "topic": "{topic}"\n            - "persuasion_pattern": "<SELECTED_PATTERN>" """
content = re.sub(pattern2, replacement2, content, flags=re.DOTALL)


# Replace fallback
pattern3 = r'"strategy_used": "Direct Response"'
replacement3 = '"persuasion_pattern": "DIRECT_RESPONSE"'
content = re.sub(pattern3, replacement3, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patch applied successfully.")
