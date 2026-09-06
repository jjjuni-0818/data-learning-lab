import type { ChapterContent } from '../types/chapter'

export const pythonDbIntegration: ChapterContent = {
  chapterId: '03_python_db_integration',
  pyodidePackages: ['sqlite3'],
  description:
    '앞 챕터들이 테이블 구조와 SELECT 조회에 집중했다면, 이번엔 Python 코드로 데이터베이스를 "다루는" 법을 익혀요. 재고 관리 프로그램을 만든다고 생각하고, UPDATE/DELETE로 데이터를 바꾸고, 트랜잭션(commit/rollback)으로 안전하게 처리하고, DB 행을 파이썬 딕셔너리로 다루는 실전 패턴까지 다룹니다. (실제 서비스에서는 PyMySQL 같은 라이브러리로 MySQL에, 여기서는 같은 방식으로 SQLite에 연결해요)',
  exampleCode: `import sqlite3

conn = sqlite3.connect(':memory:')
cur = conn.cursor()
cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER, price INTEGER)')
cur.execute("INSERT INTO items (name, stock, price) VALUES ('마우스', 10, 30000)")
conn.commit()

# 가격을 변경(UPDATE)하고, 다시 조회해서 확인
cur.execute('UPDATE items SET price = ? WHERE name = ?', (25000, '마우스'))
conn.commit()

cur.execute('SELECT * FROM items')
print(cur.fetchall())
`,
  tiers: [
    {
      key: 'beginner',
      label: '초급',
      exercises: [
        {
          id: 'update_price',
          prompt: 'item_id에 해당하는 상품의 가격을 new_price로 변경(UPDATE)하고, 변경된 가격을 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def update_price(items, item_id, new_price):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER, price INTEGER)')
    cur.executemany('INSERT INTO items (id, name, stock, price) VALUES (?, ?, ?, ?)', items)
    conn.commit()
    # TODO: UPDATE items SET price = ? WHERE id = ? 로 가격을 바꾸고 commit한 뒤,
    # 다시 SELECT로 조회해서 바뀐 가격을 반환하세요
    pass
`,
          assertion: `items = [(1, '마우스', 10, 30000), (2, '키보드', 5, 80000)]
assert update_price(items, 1, 25000) == 25000`,
          hint: "cur.execute('UPDATE items SET price = ? WHERE id = ?', (new_price, item_id)) 실행 후 conn.commit()을 꼭 호출하세요. commit을 해야 변경사항이 실제로 저장돼요.",
          solutionCode: `import sqlite3

def update_price(items, item_id, new_price):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER, price INTEGER)')
    cur.executemany('INSERT INTO items (id, name, stock, price) VALUES (?, ?, ?, ?)', items)
    conn.commit()
    cur.execute('UPDATE items SET price = ? WHERE id = ?', (new_price, item_id))
    conn.commit()
    cur.execute('SELECT price FROM items WHERE id = ?', (item_id,))
    result = cur.fetchone()[0]
    conn.close()
    return result
`,
          solutionExplain: 'UPDATE는 기존 행의 값을 바꿔요. WHERE 조건 없이 UPDATE를 실행하면 테이블의 모든 행이 바뀌어버리니, 실무에서는 항상 WHERE로 대상을 정확히 지정하는 게 중요해요.',
        },
        {
          id: 'delete_out_of_stock',
          prompt: '재고(stock)가 0인 상품을 모두 삭제(DELETE)하고, 남은 상품 개수를 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def delete_out_of_stock(items):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER, price INTEGER)')
    cur.executemany('INSERT INTO items (id, name, stock, price) VALUES (?, ?, ?, ?)', items)
    conn.commit()
    # TODO: DELETE FROM items WHERE stock = 0 으로 재고 없는 상품을 지우고 commit한 뒤,
    # 남은 상품 개수(COUNT)를 반환하세요
    pass
`,
          assertion: `items = [(1, '마우스', 0, 30000), (2, '키보드', 5, 80000), (3, '모니터', 0, 250000)]
assert delete_out_of_stock(items) == 1`,
          hint: "cur.execute('DELETE FROM items WHERE stock = 0') 실행 후 commit, 그다음 SELECT COUNT(*) FROM items로 남은 개수를 확인하세요.",
          solutionCode: `import sqlite3

def delete_out_of_stock(items):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER, price INTEGER)')
    cur.executemany('INSERT INTO items (id, name, stock, price) VALUES (?, ?, ?, ?)', items)
    conn.commit()
    cur.execute('DELETE FROM items WHERE stock = 0')
    conn.commit()
    cur.execute('SELECT COUNT(*) FROM items')
    result = cur.fetchone()[0]
    conn.close()
    return result
`,
          solutionExplain: 'DELETE도 UPDATE처럼 WHERE로 대상을 지정해요. "재고 소진 상품 정리"처럼 조건에 맞는 행만 골라 지우는 게 실무에서 매우 흔한 작업입니다.',
        },
        {
          id: 'get_item_as_dict',
          prompt: '조회한 상품 행(튜플)을, 컬럼 이름을 key로 하는 딕셔너리로 변환해서 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def get_item_as_dict(items, item_id):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER, price INTEGER)')
    cur.executemany('INSERT INTO items (id, name, stock, price) VALUES (?, ?, ?, ?)', items)
    conn.commit()
    cur.execute('SELECT * FROM items WHERE id = ?', (item_id,))
    row = cur.fetchone()
    # TODO: cur.description에서 컬럼 이름들을 꺼내서, row와 짝지어 딕셔너리로 만들어 반환하세요
    pass
`,
          assertion: `items = [(1, '마우스', 10, 30000), (2, '키보드', 5, 80000)]
assert get_item_as_dict(items, 2) == {'id': 2, 'name': '키보드', 'stock': 5, 'price': 80000}`,
          hint: "cur.description은 (컬럼이름, ...) 형태의 튜플 리스트예요. columns = [d[0] for d in cur.description] 으로 이름만 뽑은 뒤, dict(zip(columns, row))로 합쳐보세요.",
          solutionCode: `import sqlite3

def get_item_as_dict(items, item_id):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER, price INTEGER)')
    cur.executemany('INSERT INTO items (id, name, stock, price) VALUES (?, ?, ?, ?)', items)
    conn.commit()
    cur.execute('SELECT * FROM items WHERE id = ?', (item_id,))
    row = cur.fetchone()
    columns = [d[0] for d in cur.description]
    result = dict(zip(columns, row))
    conn.close()
    return result
`,
          solutionExplain: 'DB에서 가져온 행은 그냥 튜플(순서만 있는 값)이라 다루기 불편할 때가 많아요. cur.description으로 컬럼 이름을 알아내 딕셔너리로 바꿔주면, 이후 코드에서 row["name"]처럼 이름으로 값을 꺼낼 수 있어 실무에서 정말 자주 쓰는 패턴이에요.',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'add_item_and_get_id',
          prompt: '새 상품을 추가(INSERT)하고, 방금 추가된 상품의 id를 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def add_item_and_get_id(items, new_item):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER, price INTEGER)')
    cur.executemany('INSERT INTO items (id, name, stock, price) VALUES (?, ?, ?, ?)', items)
    conn.commit()
    # TODO: new_item(name, stock, price)을 INSERT하고 commit한 뒤,
    # 방금 추가된 행의 id(cur.lastrowid)를 반환하세요
    pass
`,
          assertion: `items = [(1, '마우스', 10, 30000), (2, '키보드', 5, 80000)]
assert add_item_and_get_id(items, ('모니터', 3, 250000)) == 3`,
          hint: 'INSERT 실행 직후, cur.lastrowid에 방금 추가된 행의 id(AUTOINCREMENT 값)가 자동으로 담겨있어요.',
          solutionCode: `import sqlite3

def add_item_and_get_id(items, new_item):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER, price INTEGER)')
    cur.executemany('INSERT INTO items (id, name, stock, price) VALUES (?, ?, ?, ?)', items)
    conn.commit()
    cur.execute('INSERT INTO items (name, stock, price) VALUES (?, ?, ?)', new_item)
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return new_id
`,
          solutionExplain: 'cur.lastrowid는 "방금 이 커서로 추가한 행의 id"를 알려줘요. 회원가입 후 새로 만들어진 사용자 id를 바로 이어서 써야 할 때처럼, 실무에서 매우 자주 쓰이는 값입니다.',
        },
        {
          id: 'adjust_stock_safely',
          prompt: '재고를 delta만큼 조정하되, 결과가 음수가 되면 실제로 반영하지 않고(rollback) 원래 재고를 유지하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def adjust_stock_safely(items, item_id, delta):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER)')
    cur.executemany('INSERT INTO items (id, name, stock) VALUES (?, ?, ?)', items)
    conn.commit()
    # TODO: 현재 재고 + delta를 계산해서, 음수면 ValueError를 발생시키고
    # except에서 conn.rollback()한 뒤 원래 재고를 반환하세요.
    # 음수가 아니면 UPDATE로 반영하고 commit한 뒤 새 재고를 반환하세요.
    pass
`,
          assertion: `items = [(1, '마우스', 10)]
assert adjust_stock_safely(items, 1, -3) == 7
assert adjust_stock_safely(items, 1, -100) == 10`,
          hint: 'try/except 안에서: 새 재고를 계산 → 음수면 raise ValueError(...) → except ValueError에서 conn.rollback() 후 원래 값을 다시 SELECT해서 반환하세요.',
          solutionCode: `import sqlite3

def adjust_stock_safely(items, item_id, delta):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER)')
    cur.executemany('INSERT INTO items (id, name, stock) VALUES (?, ?, ?)', items)
    conn.commit()
    try:
        cur.execute('SELECT stock FROM items WHERE id = ?', (item_id,))
        current = cur.fetchone()[0]
        new_stock = current + delta
        if new_stock < 0:
            raise ValueError('재고가 음수가 될 수 없습니다')
        cur.execute('UPDATE items SET stock = ? WHERE id = ?', (new_stock, item_id))
        conn.commit()
        result = new_stock
    except ValueError:
        conn.rollback()
        cur.execute('SELECT stock FROM items WHERE id = ?', (item_id,))
        result = cur.fetchone()[0]
    conn.close()
    return result
`,
          solutionExplain: '트랜잭션(transaction)은 "commit 하기 전까지의 변경을 통째로 취소(rollback)할 수 있는 안전장치"예요. "재고가 음수가 되는 건 말이 안 되니 아예 반영하지 않기"처럼, 잘못된 상태로 데이터가 바뀌는 걸 막을 때 rollback을 씁니다.',
        },
        {
          id: 'upsert_item',
          prompt: '이름이 같은 상품이 이미 있으면 재고를 더하고 가격을 갱신하고, 없으면 새로 추가하는 함수(upsert)를 완성하세요.',
          starterCode: `import sqlite3

def upsert_item(items, name, stock, price):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT UNIQUE, stock INTEGER, price INTEGER)')
    cur.executemany('INSERT INTO items (name, stock, price) VALUES (?, ?, ?)', items)
    conn.commit()
    # TODO: INSERT ... ON CONFLICT(name) DO UPDATE SET stock = stock + excluded.stock, price = excluded.price
    # 구문으로 upsert(있으면 갱신, 없으면 추가)를 실행하고 commit한 뒤,
    # 해당 name의 (stock, price)를 튜플로 반환하세요
    pass
`,
          assertion: `items = [('마우스', 10, 30000), ('키보드', 5, 80000)]
assert upsert_item(items, '마우스', 5, 28000) == (15, 28000)
assert upsert_item(items, '모니터', 2, 250000) == (2, 250000)`,
          hint: "ON CONFLICT(name) DO UPDATE SET ... 구문에서, excluded.stock은 '이번에 새로 넣으려던 값'을 가리켜요. 'INSERT INTO items (name, stock, price) VALUES (?, ?, ?) ON CONFLICT(name) DO UPDATE SET stock = stock + excluded.stock, price = excluded.price' 형태로 작성해보세요.",
          solutionCode: `import sqlite3

def upsert_item(items, name, stock, price):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT UNIQUE, stock INTEGER, price INTEGER)')
    cur.executemany('INSERT INTO items (name, stock, price) VALUES (?, ?, ?)', items)
    conn.commit()
    cur.execute('''
        INSERT INTO items (name, stock, price) VALUES (?, ?, ?)
        ON CONFLICT(name) DO UPDATE SET stock = stock + excluded.stock, price = excluded.price
    ''', (name, stock, price))
    conn.commit()
    cur.execute('SELECT stock, price FROM items WHERE name = ?', (name,))
    result = cur.fetchone()
    conn.close()
    return result
`,
          solutionExplain: 'upsert(update + insert)는 "있으면 갱신, 없으면 새로 추가"를 한 번의 쿼리로 처리하는 패턴이에요. 매번 SELECT로 존재 여부를 먼저 확인하는 것보다 간결하고 안전해서, 재고 입고 처리 같은 실무 로직에 자주 쓰입니다.',
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'manage_inventory',
          prompt: '여러 종류의 작업(추가/재고조정/삭제)을 순서대로 처리한 뒤, 최종 상품 목록을 딕셔너리 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def manage_inventory(initial_items, actions):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER, price INTEGER)')
    cur.executemany('INSERT INTO items (id, name, stock, price) VALUES (?, ?, ?, ?)', initial_items)
    conn.commit()

    # TODO: actions를 순서대로 처리하세요.
    # ('insert', name, stock, price) -> 새 상품 추가
    # ('update_stock', item_id, delta) -> 재고를 delta만큼 조정 (UPDATE ... SET stock = stock + ?)
    # ('delete', item_id) -> 해당 상품 삭제
    # 처리 후 commit하고, id 순서로 정렬된 딕셔너리 리스트를 반환하세요
    pass
`,
          assertion: `initial_items = [(1, '마우스', 10, 30000), (2, '키보드', 5, 80000)]
actions = [('update_stock', 1, -2), ('insert', '모니터', 3, 250000), ('delete', 2)]
result = manage_inventory(initial_items, actions)
assert result == [
    {'id': 1, 'name': '마우스', 'stock': 8, 'price': 30000},
    {'id': 3, 'name': '모니터', 'stock': 3, 'price': 250000},
], f"결과: {result}"`,
          hint: "action[0]으로 종류를 구분해서 if/elif로 분기하세요. 각 경우에 맞는 INSERT/UPDATE/DELETE를 실행하고, 마지막에 SELECT * FROM items ORDER BY id로 조회해서 이 챕터 초반에 배운 딕셔너리 변환 방식을 재사용하세요.",
          solutionCode: `import sqlite3

def manage_inventory(initial_items, actions):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER, price INTEGER)')
    cur.executemany('INSERT INTO items (id, name, stock, price) VALUES (?, ?, ?, ?)', initial_items)
    conn.commit()

    for action in actions:
        kind = action[0]
        if kind == 'insert':
            _, name, stock, price = action
            cur.execute('INSERT INTO items (name, stock, price) VALUES (?, ?, ?)', (name, stock, price))
        elif kind == 'update_stock':
            _, item_id, delta = action
            cur.execute('UPDATE items SET stock = stock + ? WHERE id = ?', (delta, item_id))
        elif kind == 'delete':
            _, item_id = action
            cur.execute('DELETE FROM items WHERE id = ?', (item_id,))
    conn.commit()

    cur.execute('SELECT id, name, stock, price FROM items ORDER BY id')
    columns = [d[0] for d in cur.description]
    result = [dict(zip(columns, row)) for row in cur.fetchall()]
    conn.close()
    return result
`,
          solutionExplain: '실제 백엔드 코드는 이렇게 "여러 종류의 요청을 받아서 종류별로 다른 SQL을 실행"하는 함수가 많아요. INSERT/UPDATE/DELETE를 한 함수 안에서 조합해 처리하는 감각을 익히는 문제예요.',
        },
        {
          id: 'batch_update_prices',
          prompt: '여러 상품의 가격을 한 번에 조정하되, 하나라도 결과가 음수가 되면 전부 취소(rollback)하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def batch_update_prices(items, updates):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, price INTEGER)')
    cur.executemany('INSERT INTO items (id, price) VALUES (?, ?)', items)
    conn.commit()
    # TODO: updates의 각 (item_id, delta)에 대해 새 가격을 계산하고,
    # 하나라도 음수면 ValueError를 발생시켜 전체를 rollback하세요.
    # 모두 성공하면 commit하세요. (try/except 하나로 전체 반복문을 감싸야 해요)
    # 마지막엔 항상 {id: price} 딕셔너리를 반환하세요
    pass
`,
          assertion: `items = [(1, 30000), (2, 80000)]
assert batch_update_prices(items, [(1, 5000), (2, -10000)]) == {1: 35000, 2: 70000}
assert batch_update_prices(items, [(1, 5000), (2, -200000)]) == {1: 30000, 2: 80000}`,
          hint: 'for 반복문 전체를 하나의 try 블록으로 감싸세요. 반복 중 하나라도 실패하면 그 지점에서 raise해서 except로 빠지고, conn.rollback()으로 그 시점까지 실행된 UPDATE들까지 전부 취소해야 해요.',
          solutionCode: `import sqlite3

def batch_update_prices(items, updates):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, price INTEGER)')
    cur.executemany('INSERT INTO items (id, price) VALUES (?, ?)', items)
    conn.commit()
    try:
        for item_id, delta in updates:
            cur.execute('SELECT price FROM items WHERE id = ?', (item_id,))
            price = cur.fetchone()[0]
            new_price = price + delta
            if new_price < 0:
                raise ValueError('가격이 음수가 될 수 없습니다')
            cur.execute('UPDATE items SET price = ? WHERE id = ?', (new_price, item_id))
        conn.commit()
    except ValueError:
        conn.rollback()
    cur.execute('SELECT id, price FROM items ORDER BY id')
    result = dict(cur.fetchall())
    conn.close()
    return result
`,
          solutionExplain: '"여러 변경사항을 한 묶음으로 처리하고, 하나라도 실패하면 전부 취소"하는 건 트랜잭션의 핵심 존재 이유예요. 은행 계좌 이체(출금은 됐는데 입금이 실패)처럼, 일부만 반영되면 안 되는 상황에서 꼭 필요한 패턴입니다.',
        },
        {
          id: 'process_orders',
          prompt: '여러 건의 주문을 처리하되, 재고가 부족한 주문은 건너뛰는 함수를 완성하세요. 처리/건너뜀 개수와 최종 재고를 요약해서 반환합니다.',
          starterCode: `import sqlite3

def process_orders(items, orders):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, stock INTEGER)')
    cur.executemany('INSERT INTO items (id, stock) VALUES (?, ?)', items)
    conn.commit()

    processed = 0
    skipped = 0
    # TODO: orders의 각 (item_id, quantity)에 대해:
    # - 현재 재고를 조회해서 quantity 이상이면 재고를 줄이고(UPDATE) commit, processed += 1
    # - 부족하면 아무것도 하지 않고 skipped += 1
    # 마지막엔 {'processed': ..., 'skipped': ..., 'final_stock': {id: 재고}} 를 반환하세요

    conn.close()
    return {'processed': processed, 'skipped': skipped, 'final_stock': {}}
`,
          assertion: `items = [(1, 10), (2, 3)]
orders = [(1, 4), (2, 5), (1, 6)]
result = process_orders(items, orders)
assert result == {'processed': 2, 'skipped': 1, 'final_stock': {1: 0, 2: 3}}, f"결과: {result}"`,
          hint: '주문마다 먼저 SELECT stock으로 현재 재고를 확인하고, stock >= quantity일 때만 UPDATE items SET stock = stock - ? 를 실행하고 commit하세요. 그렇지 않으면 아무 것도 하지 않고 skipped만 늘리세요.',
          solutionCode: `import sqlite3

def process_orders(items, orders):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, stock INTEGER)')
    cur.executemany('INSERT INTO items (id, stock) VALUES (?, ?)', items)
    conn.commit()

    processed = 0
    skipped = 0
    for item_id, qty in orders:
        cur.execute('SELECT stock FROM items WHERE id = ?', (item_id,))
        stock = cur.fetchone()[0]
        if stock >= qty:
            cur.execute('UPDATE items SET stock = stock - ? WHERE id = ?', (qty, item_id))
            conn.commit()
            processed += 1
        else:
            skipped += 1

    cur.execute('SELECT id, stock FROM items ORDER BY id')
    final_stock = dict(cur.fetchall())
    conn.close()
    return {'processed': processed, 'skipped': skipped, 'final_stock': final_stock}
`,
          solutionExplain: '이 챕터의 결론이에요 — SELECT로 현재 상태를 확인하고, 조건에 따라 UPDATE/INSERT/DELETE로 데이터를 바꾸고, 트랜잭션으로 안전하게 commit하는 것까지, Python으로 실제 데이터베이스를 다루는 핵심 흐름을 재고 관리 예제로 정리했어요.',
        },
      ],
    },
  ],
}
