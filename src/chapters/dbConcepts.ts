import type { ChapterContent } from '../types/chapter'

export const dbConcepts: ChapterContent = {
  chapterId: '01_db_concepts',
  pyodidePackages: ['sqlite3'],
  description:
    '데이터베이스는 "표(테이블)들을 체계적으로 저장하고 연결해서 관리하는 시스템"이에요. 실제 MySQL 서버는 브라우저에서 못 띄우니, 같은 SQL 문법을 쓰는 SQLite로 테이블/기본키/외래키 같은 핵심 개념을 직접 실습해봅니다.',
  exampleCode: `import sqlite3

conn = sqlite3.connect(':memory:')
cur = conn.cursor()
cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)')
cur.execute("INSERT INTO patients (name, age) VALUES ('민준', 17)")
cur.execute("INSERT INTO patients (name, age) VALUES ('서연', 16)")
conn.commit()

cur.execute('SELECT * FROM patients')
print(cur.fetchall())
`,
  tiers: [
    {
      key: 'beginner',
      label: '초급',
      exercises: [
        {
          id: 'create_and_count_rows',
          prompt: '환자 테이블을 만들고 데이터를 넣은 뒤, 전체 행 개수를 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def create_and_count_rows(rows):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)')
    cur.executemany('INSERT INTO patients (name, age) VALUES (?, ?)', rows)
    conn.commit()
    # TODO: SELECT COUNT(*)로 전체 행 개수를 구해서 반환하세요
    pass
`,
          assertion: `assert create_and_count_rows([('민준', 17), ('서연', 16), ('하은', 17)]) == 3`,
          hint: "cur.execute('SELECT COUNT(*) FROM patients')로 실행한 뒤, cur.fetchone()[0]으로 그 개수를 꺼낼 수 있어요.",
          solutionCode: `import sqlite3

def create_and_count_rows(rows):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)')
    cur.executemany('INSERT INTO patients (name, age) VALUES (?, ?)', rows)
    conn.commit()
    cur.execute('SELECT COUNT(*) FROM patients')
    count = cur.fetchone()[0]
    conn.close()
    return count
`,
          solutionExplain: '테이블(table)은 엑셀 시트처럼 행과 열로 이루어진 데이터 저장 단위예요. CREATE TABLE로 구조(스키마)를 만들고, INSERT로 데이터를 채워 넣습니다.',
        },
        {
          id: 'get_column_names',
          prompt: '환자 테이블을 만든 뒤, 그 테이블의 컬럼(열) 이름들을 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def get_column_names():
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)')
    # TODO: PRAGMA table_info(patients)로 컬럼 정보를 조회해서, 컬럼 이름만 리스트로 반환하세요
    pass
`,
          assertion: `assert get_column_names() == ['id', 'name', 'age']`,
          hint: "cur.execute('PRAGMA table_info(patients)')를 실행하면, 각 행에 (순번, 컬럼이름, 자료형, ...) 정보가 담겨 나와요. 각 행의 두 번째 값(인덱스 1)이 컬럼 이름이에요.",
          solutionCode: `import sqlite3

def get_column_names():
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)')
    cur.execute('PRAGMA table_info(patients)')
    columns = [row[1] for row in cur.fetchall()]
    conn.close()
    return columns
`,
          solutionExplain: '스키마(schema)는 "이 테이블에 어떤 컬럼들이, 어떤 자료형으로 있는지"에 대한 설계도예요. PRAGMA table_info는 그 설계도를 직접 조회하는 SQLite 전용 명령어입니다.',
        },
        {
          id: 'check_primary_key_constraint',
          prompt: '같은 id로 두 번 데이터를 넣으려고 시도했을 때, 실제로 오류가 나는지 확인해서 True/False로 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def check_primary_key_constraint():
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT)')
    cur.execute("INSERT INTO patients (id, name) VALUES (1, '민준')")
    conn.commit()
    # TODO: 같은 id(1)로 다시 INSERT를 시도하고, sqlite3.IntegrityError가 나면 True,
    # 안 나면 False를 반환하세요 (try/except 사용)
    pass
`,
          assertion: `assert check_primary_key_constraint() == True`,
          hint: "try: cur.execute(...) / except sqlite3.IntegrityError: return True 형태로 작성해보세요.",
          solutionCode: `import sqlite3

def check_primary_key_constraint():
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT)')
    cur.execute("INSERT INTO patients (id, name) VALUES (1, '민준')")
    conn.commit()
    try:
        cur.execute("INSERT INTO patients (id, name) VALUES (1, '서연')")
        conn.commit()
        return False
    except sqlite3.IntegrityError:
        return True
`,
          solutionExplain: '기본키(Primary Key, PK)는 "이 테이블에서 각 행을 유일하게 구분하는 값"이에요. 같은 값을 두 번 넣으려고 하면 데이터베이스가 자동으로 막아줍니다 — 이게 바로 PK의 핵심 역할이에요.',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'link_two_tables',
          prompt: '환자(patients)와 진료기록(visits) 두 테이블을 외래키로 연결해서, 환자 이름과 진료 사유를 함께 조회하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def link_two_tables():
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT)')
    cur.execute('CREATE TABLE visits (id INTEGER PRIMARY KEY, patient_id INTEGER, reason TEXT)')
    cur.execute("INSERT INTO patients (id, name) VALUES (1, '민준')")
    cur.execute("INSERT INTO patients (id, name) VALUES (2, '서연')")
    cur.execute("INSERT INTO visits (patient_id, reason) VALUES (1, '감기')")
    cur.execute("INSERT INTO visits (patient_id, reason) VALUES (2, '독감')")
    conn.commit()
    # TODO: patients와 visits를 patient_id 기준으로 JOIN해서,
    # (환자이름, 진료사유) 튜플들의 리스트를 반환하세요
    pass
`,
          assertion: `assert link_two_tables() == [('민준', '감기'), ('서연', '독감')]`,
          hint: "SELECT patients.name, visits.reason FROM patients JOIN visits ON patients.id = visits.patient_id 형태의 쿼리를 실행해보세요.",
          solutionCode: `import sqlite3

def link_two_tables():
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT)')
    cur.execute('CREATE TABLE visits (id INTEGER PRIMARY KEY, patient_id INTEGER, reason TEXT)')
    cur.execute("INSERT INTO patients (id, name) VALUES (1, '민준')")
    cur.execute("INSERT INTO patients (id, name) VALUES (2, '서연')")
    cur.execute("INSERT INTO visits (patient_id, reason) VALUES (1, '감기')")
    cur.execute("INSERT INTO visits (patient_id, reason) VALUES (2, '독감')")
    conn.commit()
    cur.execute('''
        SELECT patients.name, visits.reason
        FROM patients
        JOIN visits ON patients.id = visits.patient_id
    ''')
    result = cur.fetchall()
    conn.close()
    return result
`,
          solutionExplain: 'visits 테이블의 patient_id는 patients 테이블의 id를 가리키는 외래키(Foreign Key, FK)예요. 이렇게 테이블을 나눠서 관계(참조)로 연결하는 게 관계형 데이터베이스의 핵심 구조입니다.',
        },
        {
          id: 'count_visits_per_patient',
          prompt: '환자별로 진료받은 횟수를 {환자이름: 횟수} 딕셔너리로 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def count_visits_per_patient():
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT)')
    cur.execute('CREATE TABLE visits (id INTEGER PRIMARY KEY, patient_id INTEGER)')
    cur.execute("INSERT INTO patients (id, name) VALUES (1, '민준')")
    cur.execute("INSERT INTO patients (id, name) VALUES (2, '서연')")
    cur.executemany('INSERT INTO visits (patient_id) VALUES (?)', [(1,), (1,), (2,)])
    conn.commit()
    # TODO: JOIN + GROUP BY로 환자별 진료 횟수를 딕셔너리로 반환하세요
    pass
`,
          assertion: `assert count_visits_per_patient() == {'민준': 2, '서연': 1}`,
          hint: "SELECT patients.name, COUNT(visits.id) FROM patients JOIN visits ON ... GROUP BY patients.name 을 실행한 뒤, dict(cur.fetchall())로 딕셔너리로 바꿔보세요.",
          solutionCode: `import sqlite3

def count_visits_per_patient():
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT)')
    cur.execute('CREATE TABLE visits (id INTEGER PRIMARY KEY, patient_id INTEGER)')
    cur.execute("INSERT INTO patients (id, name) VALUES (1, '민준')")
    cur.execute("INSERT INTO patients (id, name) VALUES (2, '서연')")
    cur.executemany('INSERT INTO visits (patient_id) VALUES (?)', [(1,), (1,), (2,)])
    conn.commit()
    cur.execute('''
        SELECT patients.name, COUNT(visits.id)
        FROM patients
        JOIN visits ON patients.id = visits.patient_id
        GROUP BY patients.name
    ''')
    result = dict(cur.fetchall())
    conn.close()
    return result
`,
          solutionExplain: 'JOIN으로 두 테이블을 연결한 뒤 GROUP BY를 쓰면, "각 환자가 진료를 몇 번 받았는지"처럼 관계를 활용한 통계를 낼 수 있어요.',
        },
        {
          id: 'enforce_foreign_key',
          prompt: '외래키 제약을 활성화한 상태에서, 존재하지 않는 환자 id를 참조하는 진료기록을 넣으려고 하면 실제로 막히는지 True/False로 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def enforce_foreign_key():
    conn = sqlite3.connect(':memory:')
    conn.execute('PRAGMA foreign_keys = ON')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT)')
    cur.execute('''
        CREATE TABLE visits (
            id INTEGER PRIMARY KEY,
            patient_id INTEGER,
            FOREIGN KEY (patient_id) REFERENCES patients(id)
        )
    ''')
    conn.commit()
    # TODO: 존재하지 않는 patient_id(999)로 INSERT를 시도하고,
    # sqlite3.IntegrityError가 나면 True, 안 나면 False를 반환하세요
    pass
`,
          assertion: `assert enforce_foreign_key() == True`,
          hint: 'PRIMARY KEY 문제와 똑같은 패턴이에요 — try/except sqlite3.IntegrityError를 써보세요.',
          solutionCode: `import sqlite3

def enforce_foreign_key():
    conn = sqlite3.connect(':memory:')
    conn.execute('PRAGMA foreign_keys = ON')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT)')
    cur.execute('''
        CREATE TABLE visits (
            id INTEGER PRIMARY KEY,
            patient_id INTEGER,
            FOREIGN KEY (patient_id) REFERENCES patients(id)
        )
    ''')
    conn.commit()
    try:
        cur.execute('INSERT INTO visits (patient_id) VALUES (999)')
        conn.commit()
        return False
    except sqlite3.IntegrityError:
        return True
`,
          solutionExplain: '외래키 제약(FK constraint)을 켜두면, "존재하지 않는 환자를 진료했다"는 말이 안 되는 데이터가 아예 저장되지 못하게 막아줘요. 이게 바로 관계형 DB가 데이터의 일관성을 지키는 방법입니다.',
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'get_table_list',
          prompt: '데이터베이스 안에 어떤 테이블들이 있는지, 이름을 정렬된 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def get_table_list():
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY)')
    cur.execute('CREATE TABLE visits (id INTEGER PRIMARY KEY)')
    # TODO: sqlite_master에서 테이블 이름들을 조회해서 정렬된 리스트로 반환하세요
    pass
`,
          assertion: `assert get_table_list() == ['patients', 'visits']`,
          hint: "SELECT name FROM sqlite_master WHERE type='table' 로 모든 테이블 이름을 조회할 수 있어요.",
          solutionCode: `import sqlite3

def get_table_list():
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY)')
    cur.execute('CREATE TABLE visits (id INTEGER PRIMARY KEY)')
    cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = sorted([row[0] for row in cur.fetchall()])
    conn.close()
    return tables
`,
          solutionExplain: 'sqlite_master는 SQLite가 자기 자신의 스키마 정보(어떤 테이블/인덱스가 있는지)를 저장해두는 특별한 시스템 테이블이에요.',
        },
        {
          id: 'schema_column_summary',
          prompt: '데이터베이스 안의 모든 테이블에 대해, {테이블이름: [컬럼이름들]} 형태의 요약 딕셔너리를 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def schema_column_summary():
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT)')
    cur.execute('CREATE TABLE visits (id INTEGER PRIMARY KEY, patient_id INTEGER, reason TEXT)')
    cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
    table_names = [row[0] for row in cur.fetchall()]
    # TODO: 각 테이블마다 PRAGMA table_info로 컬럼 이름을 조회해서
    # {테이블이름: [컬럼이름들]} 딕셔너리로 반환하세요
    pass
`,
          assertion: `assert schema_column_summary() == {'patients': ['id', 'name'], 'visits': ['id', 'patient_id', 'reason']}`,
          hint: '앞에서 배운 get_column_names 문제와 get_table_list 문제를 조합해보세요. 테이블 이름들을 순회하면서 각각 PRAGMA table_info를 실행하면 돼요.',
          solutionCode: `import sqlite3

def schema_column_summary():
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT)')
    cur.execute('CREATE TABLE visits (id INTEGER PRIMARY KEY, patient_id INTEGER, reason TEXT)')
    cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
    table_names = [row[0] for row in cur.fetchall()]
    summary = {}
    for t in table_names:
        cur.execute(f'PRAGMA table_info({t})')
        summary[t] = [row[1] for row in cur.fetchall()]
    conn.close()
    return summary
`,
          solutionExplain: '이렇게 스키마 정보를 코드로 조회할 수 있으면, 데이터베이스 구조를 문서화하거나 자동으로 점검하는 도구를 만들 때 활용할 수 있어요.',
        },
        {
          id: 'build_mini_health_schema',
          prompt: '환자와 진료기록 데이터를 받아 미니 스키마를 구축하고, {환자수, 진료기록수, 테이블목록}을 담은 요약 딕셔너리를 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def build_mini_health_schema(patients_data, visits_data):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT)')
    cur.execute('CREATE TABLE visits (id INTEGER PRIMARY KEY, patient_id INTEGER, reason TEXT)')
    cur.executemany('INSERT INTO patients (id, name) VALUES (?, ?)', patients_data)
    cur.executemany('INSERT INTO visits (patient_id, reason) VALUES (?, ?)', visits_data)
    conn.commit()
    # TODO: {'patient_count': 환자수, 'visit_count': 진료기록수, 'tables': 정렬된테이블목록} 을 반환하세요
    pass
`,
          assertion: `result = build_mini_health_schema([(1, '민준'), (2, '서연')], [(1, '감기'), (1, '두통'), (2, '독감')])
assert result == {'patient_count': 2, 'visit_count': 3, 'tables': ['patients', 'visits']}, f"결과: {result}"`,
          hint: '이 챕터에서 배운 것들을 조합해보세요: COUNT(*)로 각 테이블의 행 개수를, sqlite_master로 테이블 목록을 구할 수 있어요.',
          solutionCode: `import sqlite3

def build_mini_health_schema(patients_data, visits_data):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT)')
    cur.execute('CREATE TABLE visits (id INTEGER PRIMARY KEY, patient_id INTEGER, reason TEXT)')
    cur.executemany('INSERT INTO patients (id, name) VALUES (?, ?)', patients_data)
    cur.executemany('INSERT INTO visits (patient_id, reason) VALUES (?, ?)', visits_data)
    conn.commit()
    cur.execute('SELECT COUNT(*) FROM patients')
    patient_count = cur.fetchone()[0]
    cur.execute('SELECT COUNT(*) FROM visits')
    visit_count = cur.fetchone()[0]
    cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = sorted([row[0] for row in cur.fetchall()])
    conn.close()
    return {'patient_count': patient_count, 'visit_count': visit_count, 'tables': tables}
`,
          solutionExplain: '이 챕터의 결론이에요 — 테이블 만들기(스키마), 데이터 넣기, 기본키/외래키로 관계 맺기, 그리고 그 구조를 다시 조회하기까지, 관계형 데이터베이스의 기본 뼈대를 한 번에 정리해봤어요.',
        },
      ],
    },
  ],
}
