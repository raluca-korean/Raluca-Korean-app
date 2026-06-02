import json

with open('data/exercises.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

extra_chains = [
    # T6-09 second chain: focus on ex4 — 준비한 만큼 자신감이 생겨요.
    {
        "lessonId": "T6-09", "topik": 6,
        "tiles": [
            "준비한 만큼 자신감이 생겨요.",
            "시험 준비를 열심히 했어요.",
            "이제 시험이 두렵지 않아요.",
            "자신감 있게 시험장에 들어갔어요."
        ],
        "correct": [
            "시험 준비를 열심히 했어요.",
            "준비한 만큼 자신감이 생겨요.",
            "자신감 있게 시험장에 들어갔어요.",
            "이제 시험이 두렵지 않아요."
        ],
        "context": {"ro": "Pregătirea aduce încredere la examen.", "en": "Preparation brings confidence at the exam."}
    },
    # T6-10 second chain: focus on ex4 — 다이어트 중인데 케이크를 먹고 말았어요.
    {
        "lessonId": "T6-10", "topik": 6,
        "tiles": [
            "다이어트 중인데 케이크를 먹고 말았어요.",
            "케이크가 너무 맛있어 보였어요.",
            "다이어트를 다시 시작하기로 했어요.",
            "의지가 약한 것 같아서 속상해요."
        ],
        "correct": [
            "케이크가 너무 맛있어 보였어요.",
            "다이어트 중인데 케이크를 먹고 말았어요.",
            "의지가 약한 것 같아서 속상해요.",
            "다이어트를 다시 시작하기로 했어요."
        ],
        "context": {"ro": "Căderea la tentația prăjiturii în timp ce ești la dietă.", "en": "Giving in to cake temptation while on a diet."}
    },
    # T6-11 second chain: focus on ex4 — 선택한 이상 후회하지 마세요.
    {
        "lessonId": "T6-11", "topik": 6,
        "tiles": [
            "선택한 이상 후회하지 마세요.",
            "그 회사에 입사하기로 결정했어요.",
            "결정을 믿고 최선을 다할 거예요.",
            "주변에서 여러 조언이 있었어요."
        ],
        "correct": [
            "주변에서 여러 조언이 있었어요.",
            "그 회사에 입사하기로 결정했어요.",
            "선택한 이상 후회하지 마세요.",
            "결정을 믿고 최선을 다할 거예요."
        ],
        "context": {"ro": "Decizia de a accepta un job și determinarea de a merge înainte.", "en": "Deciding to take a job and being determined to move forward."}
    },
    # T6-12 second chain: focus on ex4 — 스트레스가 많은 탓에 건강이 나빠졌어요.
    {
        "lessonId": "T6-12", "topik": 6,
        "tiles": [
            "스트레스가 많은 탓에 건강이 나빠졌어요.",
            "의사 선생님께 쉬는 것이 중요하다고 들었어요.",
            "요즘 야근이 너무 많아요.",
            "건강을 위해 휴가를 내기로 했어요."
        ],
        "correct": [
            "요즘 야근이 너무 많아요.",
            "스트레스가 많은 탓에 건강이 나빠졌어요.",
            "의사 선생님께 쉬는 것이 중요하다고 들었어요.",
            "건강을 위해 휴가를 내기로 했어요."
        ],
        "context": {"ro": "Stresul de la muncă care afectează sănătatea.", "en": "Work stress affecting health."}
    },
    # T6-13 second chain: focus on ex4 — 안전이 최우선이므로 규칙을 반드시 지켜야 합니다.
    {
        "lessonId": "T6-13", "topik": 6,
        "tiles": [
            "안전이 최우선이므로 규칙을 반드시 지켜야 합니다.",
            "오늘 안전 교육이 있었어요.",
            "모두가 규칙을 잘 지키면 사고가 줄어요.",
            "안전 규칙을 꼭 기억해 주세요."
        ],
        "correct": [
            "오늘 안전 교육이 있었어요.",
            "안전이 최우선이므로 규칙을 반드시 지켜야 합니다.",
            "모두가 규칙을 잘 지키면 사고가 줄어요.",
            "안전 규칙을 꼭 기억해 주세요."
        ],
        "context": {"ro": "Educație pentru siguranță — regulile salvează vieți.", "en": "Safety education — rules save lives."}
    },
    # T6-14 second chain: focus on ex4 — 추운데도 반팔을 입고 나왔어요.
    {
        "lessonId": "T6-14", "topik": 6,
        "tiles": [
            "추운데도 반팔을 입고 나왔어요.",
            "오늘 아침 기온이 많이 낮았어요.",
            "감기 걸리지 않도록 조심해야겠어요.",
            "주변 친구들이 걱정해 줬어요."
        ],
        "correct": [
            "오늘 아침 기온이 많이 낮았어요.",
            "추운데도 반팔을 입고 나왔어요.",
            "주변 친구들이 걱정해 줬어요.",
            "감기 걸리지 않도록 조심해야겠어요."
        ],
        "context": {"ro": "O zi rece dar cu haine prea ușoare.", "en": "A cold day but dressed too lightly."}
    },
    # T6-15 second chain: focus on ex4 — 이 소식이 중요하기에 빨리 알려드리고 싶었어요.
    {
        "lessonId": "T6-15", "topik": 6,
        "tiles": [
            "이 소식이 중요하기에 빨리 알려드리고 싶었어요.",
            "회의 일정이 변경됐어요.",
            "모두 미리 알고 준비하면 좋겠어요.",
            "연락이 늦어서 죄송합니다."
        ],
        "correct": [
            "회의 일정이 변경됐어요.",
            "이 소식이 중요하기에 빨리 알려드리고 싶었어요.",
            "연락이 늦어서 죄송합니다.",
            "모두 미리 알고 준비하면 좋겠어요."
        ],
        "context": {"ro": "Anunțarea urgentă a unei schimbări de program.", "en": "Urgently announcing a schedule change."}
    },
    # T6-16 second chain: focus on ex4 — 꽃이 예쁘길래 사진을 찍었어요.
    {
        "lessonId": "T6-16", "topik": 6,
        "tiles": [
            "꽃이 예쁘길래 사진을 찍었어요.",
            "봄이 되어 공원에 꽃이 많이 폈어요.",
            "사진을 SNS에 올렸어요.",
            "많은 친구들이 좋아요를 눌렀어요."
        ],
        "correct": [
            "봄이 되어 공원에 꽃이 많이 폈어요.",
            "꽃이 예쁘길래 사진을 찍었어요.",
            "사진을 SNS에 올렸어요.",
            "많은 친구들이 좋아요를 눌렀어요."
        ],
        "context": {"ro": "Fotografierea florilor de primăvară și distribuirea pe rețele sociale.", "en": "Photographing spring flowers and sharing on social media."}
    },
]

data['chain'].extend(extra_chains)

with open('data/exercises.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done! New counts:")
print({k: len(v) for k, v in data.items()})
