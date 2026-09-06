import type { ChapterContent } from '../types/chapter'

export const nosqlMongodb: ChapterContent = {
  chapterId: '05_nosql_mongodb',
  micropipPackages: ['mongomock'],
  description:
    '지금까지 배운 SQLite는 "관계형(RDB)" 데이터베이스예요 — 미리 정해진 표 구조에 데이터를 넣었죠. 이번엔 MongoDB로 대표되는 NoSQL(document DB)을 다뤄봐요. 데이터를 표가 아니라 파이썬 딕셔너리 같은 "문서(document)"로 저장하고, 문서마다 필드가 달라도 되는 유연한 구조가 특징이에요. (실제 MongoDB 서버 대신, 같은 파이썬 API를 그대로 흉내내는 mongomock 라이브러리로 실습해요)',
  exampleCode: `import mongomock

client = mongomock.MongoClient()
db = client['school']

db.users.insert_many([
    {'name': '민준', 'age': 17, 'city': '서울', 'hobby': '축구'},
    {'name': '서연', 'age': 16, 'city': '부산', 'hobby': '독서'},
])

results = db.users.find({'age': {'$gte': 17}})
print([doc['name'] for doc in results])
`,
  tiers: [
    {
      key: 'beginner',
      label: '초급',
      exercises: [
        {
          id: 'insert_and_count',
          prompt: '학생 정보(문서) 여러 개를 users 컬렉션에 추가하고, 전체 문서 개수를 반환하는 함수를 완성하세요.',
          starterCode: `import mongomock

def insert_and_count(users):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    # TODO: count_documents({})로 전체 문서 개수를 반환하세요
    pass
`,
          assertion: `users = [
    {'name': '민준', 'age': 17, 'city': '서울', 'hobby': '축구'},
    {'name': '서연', 'age': 16, 'city': '부산', 'hobby': '독서'},
    {'name': '하은', 'age': 17, 'city': '서울', 'hobby': '게임'},
]
assert insert_and_count(users) == 3`,
          hint: "db.users.count_documents({})처럼 빈 딕셔너리를 조건으로 넘기면 '조건 없음' = 전체 문서를 센다는 뜻이에요.",
          solutionCode: `import mongomock

def insert_and_count(users):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    count = db.users.count_documents({})
    return count
`,
          solutionExplain: 'MongoDB에서는 테이블 대신 "컬렉션(collection)", 행 대신 "문서(document)"라고 불러요. insert_many()로 여러 문서를 한 번에 넣고, count_documents({})로 개수를 세는 게 SQL의 INSERT+COUNT(*)에 대응돼요.',
        },
        {
          id: 'find_older_than',
          prompt: '나이가 min_age 이상인 학생 이름을 이름순으로 정렬해 반환하는 함수를 완성하세요.',
          starterCode: `import mongomock

def find_older_than(users, min_age):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    # TODO: find({'age': {'$gte': min_age}})로 조회하고 .sort('name', 1)로 정렬한 뒤,
    # 이름만 리스트로 뽑아서 반환하세요
    pass
`,
          assertion: `users = [
    {'name': '민준', 'age': 17, 'city': '서울', 'hobby': '축구'},
    {'name': '서연', 'age': 16, 'city': '부산', 'hobby': '독서'},
    {'name': '하은', 'age': 17, 'city': '서울', 'hobby': '게임'},
]
assert find_older_than(users, 17) == ['민준', '하은']`,
          hint: "MongoDB의 조회 조건은 파이썬 딕셔너리로 표현해요. {'$gte': min_age}는 '이 값 이상'이라는 뜻의 연산자예요. find(조건).sort('컬럼명', 1)로 오름차순 정렬할 수 있어요.",
          solutionCode: `import mongomock

def find_older_than(users, min_age):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    results = db.users.find({'age': {'$gte': min_age}}).sort('name', 1)
    names = [doc['name'] for doc in results]
    return names
`,
          solutionExplain: 'SQL의 WHERE age >= ?가 MongoDB에서는 {\'age\': {\'$gte\': 값}}처럼 딕셔너리 안에 연산자를 넣는 방식으로 바뀌어요. $gte(이상), $lte(이하), $gt(초과), $lt(미만) 같은 연산자를 자주 씁니다.',
        },
        {
          id: 'find_one_users_city',
          prompt: '이름으로 학생 한 명을 찾아서, 그 학생이 사는 도시를 반환하는 함수를 완성하세요.',
          starterCode: `import mongomock

def find_one_users_city(users, name):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    # TODO: find_one({'name': name})으로 문서 하나를 찾아서, 그 문서의 'city' 값을 반환하세요
    pass
`,
          assertion: `users = [
    {'name': '민준', 'age': 17, 'city': '서울', 'hobby': '축구'},
    {'name': '서연', 'age': 16, 'city': '부산', 'hobby': '독서'},
]
assert find_one_users_city(users, '서연') == '부산'`,
          hint: "find_one({'name': name})은 조건에 맞는 문서 딱 하나만 (딕셔너리로) 반환해요. 찾은 문서에서 doc['city']처럼 키로 값을 꺼내세요.",
          solutionCode: `import mongomock

def find_one_users_city(users, name):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    doc = db.users.find_one({'name': name})
    return doc['city']
`,
          solutionExplain: 'find()는 조건에 맞는 문서 여러 개를 커서(반복 가능한 결과)로 돌려주고, find_one()은 그중 딱 하나만 바로 딕셔너리로 돌려줘요. "특정 조건의 문서 하나만 필요할 때"는 find_one이 더 간단해요.',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'update_user_city',
          prompt: '이름으로 학생을 찾아 사는 도시를 new_city로 변경하고, 변경된 도시를 반환하는 함수를 완성하세요.',
          starterCode: `import mongomock

def update_user_city(users, name, new_city):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    # TODO: update_one({'name': name}, {'$set': {'city': new_city}})로 값을 바꾸고,
    # 다시 find_one으로 조회해서 바뀐 city를 반환하세요
    pass
`,
          assertion: `users = [
    {'name': '민준', 'age': 17, 'city': '서울', 'hobby': '축구'},
    {'name': '서연', 'age': 16, 'city': '부산', 'hobby': '독서'},
]
assert update_user_city(users, '민준', '대전') == '대전'`,
          hint: "update_one(찾을 조건, 변경 내용)의 두 번째 인자는 {'$set': {'바꿀 필드': 새 값}} 형태예요. $set은 '이 필드 값을 이걸로 바꿔라'라는 뜻의 연산자입니다.",
          solutionCode: `import mongomock

def update_user_city(users, name, new_city):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    db.users.update_one({'name': name}, {'$set': {'city': new_city}})
    doc = db.users.find_one({'name': name})
    return doc['city']
`,
          solutionExplain: 'SQL의 UPDATE ... SET이 MongoDB에서는 update_one(조건, {\'$set\': {...}})으로 바뀌어요. 조건에 맞는 문서 중 "첫 번째 하나만" 바꾸는 게 update_one, 조건에 맞는 전부를 바꾸려면 update_many를 씁니다.',
        },
        {
          id: 'delete_users_by_city',
          prompt: '특정 도시(city)에 사는 학생을 모두 삭제하고, 남은 학생 수를 반환하는 함수를 완성하세요.',
          starterCode: `import mongomock

def delete_users_by_city(users, city):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    # TODO: delete_many({'city': city})로 해당 도시 학생들을 지우고,
    # count_documents({})로 남은 개수를 반환하세요
    pass
`,
          assertion: `users = [
    {'name': '민준', 'age': 17, 'city': '서울', 'hobby': '축구'},
    {'name': '서연', 'age': 16, 'city': '부산', 'hobby': '독서'},
    {'name': '하은', 'age': 17, 'city': '서울', 'hobby': '게임'},
]
assert delete_users_by_city(users, '서울') == 1`,
          hint: "delete_many({'city': city})는 조건에 맞는 문서를 전부 지워요. delete_one은 첫 번째 하나만 지운다는 차이를 기억하세요.",
          solutionCode: `import mongomock

def delete_users_by_city(users, city):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    db.users.delete_many({'city': city})
    remaining = db.users.count_documents({})
    return remaining
`,
          solutionExplain: 'SQL의 DELETE FROM ... WHERE가 MongoDB에서는 delete_many(조건)이에요. update_one/delete_one(하나만)과 update_many/delete_many(조건에 맞는 전부)의 차이는 실무에서 자주 실수하는 부분이라 꼭 기억해두세요.',
        },
        {
          id: 'distinct_cities',
          prompt: '학생들이 사는 도시 목록에서, 중복 없이 서로 다른 도시 이름만 정렬해서 반환하는 함수를 완성하세요.',
          starterCode: `import mongomock

def distinct_cities(users):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    # TODO: db.users.distinct('city')로 중복 없는 도시 목록을 구해서 정렬된 리스트로 반환하세요
    pass
`,
          assertion: `users = [
    {'name': '민준', 'age': 17, 'city': '서울', 'hobby': '축구'},
    {'name': '서연', 'age': 16, 'city': '부산', 'hobby': '독서'},
    {'name': '하은', 'age': 17, 'city': '서울', 'hobby': '게임'},
]
assert distinct_cities(users) == ['부산', '서울']`,
          hint: "collection.distinct('필드명')은 SQL의 SELECT DISTINCT 컬럼과 같은 역할이에요. 결과는 리스트로 오니 sorted()로 정렬해보세요.",
          solutionCode: `import mongomock

def distinct_cities(users):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    cities = sorted(db.users.distinct('city'))
    return cities
`,
          solutionExplain: 'distinct()는 "이 필드에 어떤 값들이 있는지"를 중복 없이 알려줘요. 필터 드롭다운 메뉴에 들어갈 선택지를 만들 때처럼, 실무에서 자주 쓰이는 조회 방식이에요.',
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'count_by_city',
          prompt: '도시별 학생 수를 {도시: 인원수} 딕셔너리로 반환하는 함수를 완성하세요.',
          starterCode: `import mongomock

def count_by_city(users):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    # TODO: aggregate([{'$group': {'_id': '$city', 'count': {'$sum': 1}}}])로 도시별 인원수를 구해서
    # {도시: 인원수} 딕셔너리로 반환하세요
    pass
`,
          assertion: `users = [
    {'name': '민준', 'age': 17, 'city': '서울', 'hobby': '축구'},
    {'name': '서연', 'age': 16, 'city': '부산', 'hobby': '독서'},
    {'name': '하은', 'age': 17, 'city': '서울', 'hobby': '게임'},
    {'name': '도윤', 'age': 15, 'city': '부산', 'hobby': '축구'},
]
assert count_by_city(users) == {'서울': 2, '부산': 2}`,
          hint: "aggregate()는 파이프라인(pipeline, 처리 단계들의 리스트)을 받아요. {'$group': {'_id': '$city', 'count': {'$sum': 1}}}는 '도시별로 묶어서 개수를 센다'는 뜻이에요. 결과의 각 문서는 doc['_id']가 도시명, doc['count']가 인원수예요.",
          solutionCode: `import mongomock

def count_by_city(users):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    pipeline = [
        {'$group': {'_id': '$city', 'count': {'$sum': 1}}}
    ]
    results = db.users.aggregate(pipeline)
    return {doc['_id']: doc['count'] for doc in results}
`,
          solutionExplain: 'aggregate()의 $group은 SQL의 GROUP BY에 대응돼요. \'_id\'가 "무엇으로 묶을지"(그룹 기준), 그 옆의 필드들이 "각 그룹에 대해 계산할 값"(집계 결과)이에요. $sum: 1은 "그룹에 속한 문서 개수를 센다"는 뜻입니다.',
        },
        {
          id: 'find_by_hobby_list',
          prompt: '취미가 주어진 목록(hobbies) 중 하나인 학생 이름을, 이름순으로 반환하는 함수를 완성하세요.',
          starterCode: `import mongomock

def find_by_hobby_list(users, hobbies):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    # TODO: find({'hobby': {'$in': hobbies}})로 조회하고 .sort('name', 1)로 정렬한 뒤,
    # 이름만 리스트로 뽑아서 반환하세요
    pass
`,
          assertion: `users = [
    {'name': '민준', 'age': 17, 'city': '서울', 'hobby': '축구'},
    {'name': '서연', 'age': 16, 'city': '부산', 'hobby': '독서'},
    {'name': '하은', 'age': 17, 'city': '서울', 'hobby': '게임'},
    {'name': '도윤', 'age': 15, 'city': '부산', 'hobby': '축구'},
]
assert find_by_hobby_list(users, ['축구', '게임']) == ['도윤', '민준', '하은']`,
          hint: "{'$in': [값1, 값2, ...]}는 '이 값들 중 하나라도 일치하면'이라는 뜻의 연산자예요. SQL의 WHERE hobby IN (...) 과 완전히 같은 개념입니다.",
          solutionCode: `import mongomock

def find_by_hobby_list(users, hobbies):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    results = db.users.find({'hobby': {'$in': hobbies}}).sort('name', 1)
    names = [doc['name'] for doc in results]
    return names
`,
          solutionExplain: '$in은 여러 값 중 하나라도 맞으면 되는 조건을 만들 때 자주 쓰여요. "축구 또는 게임을 하는 학생 찾기"처럼, 여러 조건을 OR로 묶는 걸 간결하게 표현할 수 있습니다.',
        },
        {
          id: 'city_summary',
          prompt: '도시별로 학생 수와 평균 나이를 함께 집계해서, {도시: {count, avg_age}} 형태로 반환하는 함수를 완성하세요.',
          starterCode: `import mongomock

def city_summary(users):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    # TODO: aggregate로 $group을 사용해 도시별 count(인원수)와 avg_age($avg)를 함께 구하고,
    # {도시: {'count': 인원수, 'avg_age': 평균나이}} 딕셔너리로 반환하세요
    pass
`,
          assertion: `users = [
    {'name': '민준', 'age': 17, 'city': '서울', 'hobby': '축구'},
    {'name': '서연', 'age': 16, 'city': '부산', 'hobby': '독서'},
    {'name': '하은', 'age': 17, 'city': '서울', 'hobby': '게임'},
    {'name': '도윤', 'age': 15, 'city': '부산', 'hobby': '축구'},
]
result = city_summary(users)
assert result == {'서울': {'count': 2, 'avg_age': 17.0}, '부산': {'count': 2, 'avg_age': 15.5}}, f"결과: {result}"`,
          hint: "$group 안에 여러 집계를 동시에 넣을 수 있어요: {'_id': '$city', 'count': {'$sum': 1}, 'avg_age': {'$avg': '$age'}}. 결과 문서 하나에 도시명, count, avg_age가 함께 들어있어요.",
          solutionCode: `import mongomock

def city_summary(users):
    client = mongomock.MongoClient()
    db = client['school']
    db.users.insert_many(users)
    pipeline = [
        {'$group': {'_id': '$city', 'count': {'$sum': 1}, 'avg_age': {'$avg': '$age'}}}
    ]
    results = db.users.aggregate(pipeline)
    summary = {doc['_id']: {'count': doc['count'], 'avg_age': doc['avg_age']} for doc in results}
    return summary
`,
          solutionExplain: '이 챕터의 결론이에요 — 문서를 넣고(insert_many), 조건으로 찾고($gte/$in), 바꾸고($set), 지우고, 마지막엔 $group으로 그룹별 통계까지 내는 것까지, MongoDB(NoSQL)에서 데이터를 다루는 핵심 흐름을 정리했어요. SQL의 GROUP BY와 개념은 같지만, 파이프라인(pipeline)이라는 단계별 처리 방식으로 표현하는 게 NoSQL 집계의 특징입니다.',
        },
      ],
    },
  ],
}
