import type { ChapterContent } from '../types/chapter'

export const sqlBasics: ChapterContent = {
  chapterId: '02_sql_basics',
  pyodidePackages: ['sqlite3'],
  description:
    '이번 챕터에서는 온라인 쇼핑몰의 상품(products)·주문(orders) 데이터를 가지고, SQL로 원하는 데이터만 뽑아내는 법을 익혀요. WHERE로 조건에 맞는 데이터 찾기, ORDER BY/LIMIT로 정렬·상위 N개 뽑기, GROUP BY/HAVING으로 그룹별 집계하기, JOIN으로 여러 테이블을 연결해 분석하기까지 다뤄봅니다.',
  exampleCode: `import sqlite3

conn = sqlite3.connect(':memory:')
cur = conn.cursor()
cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
cur.executemany('INSERT INTO products (name, price) VALUES (?, ?)', [
    ('마우스', 30000),
    ('키보드', 80000),
    ('모니터', 250000),
])
conn.commit()

cur.execute('SELECT name, price FROM products WHERE price >= ? ORDER BY price DESC', (50000,))
print(cur.fetchall())
`,
  tiers: [
    {
      key: 'beginner',
      label: '초급',
      exercises: [
        {
          id: 'filter_expensive_products',
          prompt: '상품 목록에서 가격이 min_price 이상인 상품 이름만, 비싼 순서로 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def filter_expensive_products(products, min_price):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER)')
    cur.executemany('INSERT INTO products (name, category, price) VALUES (?, ?, ?)', products)
    conn.commit()
    # TODO: WHERE price >= min_price, ORDER BY price DESC로 조회해서 이름 리스트로 반환하세요
    pass
`,
          assertion: `products = [('노트북', '전자제품', 1500000), ('마우스', '전자제품', 30000), ('키보드', '전자제품', 80000), ('의자', '가구', 120000)]
assert filter_expensive_products(products, 100000) == ['노트북', '의자']`,
          hint: "cur.execute('SELECT name FROM products WHERE price >= ? ORDER BY price DESC', (min_price,)) 형태로 작성하고, ?에는 실제 값을 튜플로 넘겨보세요.",
          solutionCode: `import sqlite3

def filter_expensive_products(products, min_price):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER)')
    cur.executemany('INSERT INTO products (name, category, price) VALUES (?, ?, ?)', products)
    conn.commit()
    cur.execute('SELECT name FROM products WHERE price >= ? ORDER BY price DESC', (min_price,))
    result = [row[0] for row in cur.fetchall()]
    conn.close()
    return result
`,
          solutionExplain: 'WHERE는 조건에 맞는 행만 골라내고, ORDER BY ... DESC는 그 결과를 내림차순으로 정렬해요. `?`에 값을 직접 문자열로 이어붙이지 않고 튜플로 넘기는 방식(파라미터 바인딩)이 SQL 인젝션을 막는 안전한 방법이라 실무에서 항상 이렇게 씁니다.',
        },
        {
          id: 'top_n_expensive',
          prompt: '상품 목록에서 가격이 가장 비싼 상위 n개 상품의 이름을 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def top_n_expensive(products, n):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER)')
    cur.executemany('INSERT INTO products (name, category, price) VALUES (?, ?, ?)', products)
    conn.commit()
    # TODO: ORDER BY price DESC LIMIT n 으로 조회해서 이름 리스트로 반환하세요
    pass
`,
          assertion: `products = [('노트북', '전자제품', 1500000), ('마우스', '전자제품', 30000), ('키보드', '전자제품', 80000), ('의자', '가구', 120000)]
assert top_n_expensive(products, 2) == ['노트북', '의자']`,
          hint: "LIMIT ?를 붙여서 'SELECT name FROM products ORDER BY price DESC LIMIT ?', (n,) 형태로 실행해보세요.",
          solutionCode: `import sqlite3

def top_n_expensive(products, n):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER)')
    cur.executemany('INSERT INTO products (name, category, price) VALUES (?, ?, ?)', products)
    conn.commit()
    cur.execute('SELECT name FROM products ORDER BY price DESC LIMIT ?', (n,))
    result = [row[0] for row in cur.fetchall()]
    conn.close()
    return result
`,
          solutionExplain: 'LIMIT은 정렬된 결과에서 앞의 몇 개만 잘라서 가져와요. "가장 비싼 상품 Top 5" 같은 랭킹을 만들 때 ORDER BY + LIMIT 조합이 가장 많이 쓰이는 패턴이에요.',
        },
        {
          id: 'count_distinct_categories',
          prompt: '상품 목록에 서로 다른 카테고리가 몇 개 있는지 세는 함수를 완성하세요.',
          starterCode: `import sqlite3

def count_distinct_categories(products):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER)')
    cur.executemany('INSERT INTO products (name, category, price) VALUES (?, ?, ?)', products)
    conn.commit()
    # TODO: COUNT(DISTINCT category)로 서로 다른 카테고리 개수를 반환하세요
    pass
`,
          assertion: `products = [('노트북', '전자제품', 1500000), ('마우스', '전자제품', 30000), ('의자', '가구', 120000), ('책상', '가구', 200000)]
assert count_distinct_categories(products) == 2`,
          hint: "cur.execute('SELECT COUNT(DISTINCT category) FROM products')를 실행한 뒤, cur.fetchone()[0]으로 값을 꺼내세요.",
          solutionCode: `import sqlite3

def count_distinct_categories(products):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER)')
    cur.executemany('INSERT INTO products (name, category, price) VALUES (?, ?, ?)', products)
    conn.commit()
    cur.execute('SELECT COUNT(DISTINCT category) FROM products')
    count = cur.fetchone()[0]
    conn.close()
    return count
`,
          solutionExplain: 'DISTINCT는 중복된 값을 하나로 합쳐줘요. COUNT(DISTINCT 컬럼)은 "이 컬럼에 서로 다른 값이 몇 종류 있는지"를 셀 때 자주 쓰는 패턴입니다.',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'average_price_by_category',
          prompt: '카테고리별 평균 가격을 {카테고리: 평균가격} 딕셔너리로 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def average_price_by_category(products):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER)')
    cur.executemany('INSERT INTO products (name, category, price) VALUES (?, ?, ?)', products)
    conn.commit()
    # TODO: GROUP BY category로 묶어서 AVG(price)를 구하고, {카테고리: 평균} 딕셔너리로 반환하세요
    pass
`,
          assertion: `products = [('노트북', '전자제품', 1000000), ('마우스', '전자제품', 200000), ('의자', '가구', 100000), ('책상', '가구', 300000)]
assert average_price_by_category(products) == {'전자제품': 600000.0, '가구': 200000.0}`,
          hint: "SELECT category, AVG(price) FROM products GROUP BY category 를 실행한 뒤 dict(cur.fetchall())로 바꿔보세요.",
          solutionCode: `import sqlite3

def average_price_by_category(products):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER)')
    cur.executemany('INSERT INTO products (name, category, price) VALUES (?, ?, ?)', products)
    conn.commit()
    cur.execute('SELECT category, AVG(price) FROM products GROUP BY category')
    result = dict(cur.fetchall())
    conn.close()
    return result
`,
          solutionExplain: 'GROUP BY는 같은 값끼리 묶어주고, AVG/SUM/COUNT 같은 집계함수와 함께 쓰면 "그룹별 통계"를 낼 수 있어요. pandas의 groupby().mean()과 개념이 완전히 같습니다.',
        },
        {
          id: 'categories_with_many_products',
          prompt: '상품이 min_count개 이상 있는 카테고리 이름만 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def categories_with_many_products(products, min_count):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER)')
    cur.executemany('INSERT INTO products (name, category, price) VALUES (?, ?, ?)', products)
    conn.commit()
    # TODO: GROUP BY category HAVING COUNT(*) >= min_count 로 조회해서
    # 카테고리 이름을 정렬된 리스트로 반환하세요
    pass
`,
          assertion: `products = [('노트북', '전자제품', 1000000), ('마우스', '전자제품', 30000), ('키보드', '전자제품', 80000), ('의자', '가구', 120000)]
assert categories_with_many_products(products, 3) == ['전자제품']`,
          hint: "WHERE는 그룹으로 묶기 '전'의 개별 행을 거르고, HAVING은 그룹으로 묶은 '후'의 결과(COUNT 등)를 거를 때 써요. 'GROUP BY category HAVING COUNT(*) >= ?' 형태로 작성해보세요.",
          solutionCode: `import sqlite3

def categories_with_many_products(products, min_count):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER)')
    cur.executemany('INSERT INTO products (name, category, price) VALUES (?, ?, ?)', products)
    conn.commit()
    cur.execute('SELECT category FROM products GROUP BY category HAVING COUNT(*) >= ?', (min_count,))
    result = sorted([row[0] for row in cur.fetchall()])
    conn.close()
    return result
`,
          solutionExplain: 'HAVING은 WHERE와 비슷하지만, GROUP BY로 묶은 "그룹 결과"에 조건을 걸 때 써요. "3개 이상 팔린 카테고리만 보고 싶다" 같은 요구사항에 딱 맞는 문법입니다.',
        },
        {
          id: 'search_products',
          prompt: '이름에 keyword가 포함되면서 가격이 max_price 이하인 상품 이름을, 가나다 순으로 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def search_products(products, keyword, max_price):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER)')
    cur.executemany('INSERT INTO products (name, category, price) VALUES (?, ?, ?)', products)
    conn.commit()
    # TODO: name LIKE '%keyword%' AND price <= max_price 조건으로 조회해서
    # 이름을 ORDER BY name으로 정렬한 리스트로 반환하세요
    pass
`,
          assertion: `products = [('블루투스 마우스', '전자제품', 35000), ('무선 키보드', '전자제품', 60000), ('게이밍 마우스', '전자제품', 90000)]
assert search_products(products, '마우스', 50000) == ['블루투스 마우스']`,
          hint: "LIKE는 문자열 부분일치 검색이에요. f'%{keyword}%' 처럼 앞뒤에 %를 붙인 값을 파라미터로 넘기고, WHERE name LIKE ? AND price <= ? 형태로 조건을 두 개 이어보세요.",
          solutionCode: `import sqlite3

def search_products(products, keyword, max_price):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER)')
    cur.executemany('INSERT INTO products (name, category, price) VALUES (?, ?, ?)', products)
    conn.commit()
    cur.execute(
        'SELECT name FROM products WHERE name LIKE ? AND price <= ? ORDER BY name',
        (f'%{keyword}%', max_price),
    )
    result = [row[0] for row in cur.fetchall()]
    conn.close()
    return result
`,
          solutionExplain: 'LIKE + %는 "이 단어가 포함된 것만 찾기"처럼 검색창 기능을 만들 때 실무에서 매우 많이 쓰여요. AND로 조건을 여러 개 동시에 만족시킬 수도 있습니다.',
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'order_totals',
          prompt: '상품(products)과 주문(orders) 테이블을 JOIN해서, 각 주문의 (상품이름, 주문금액) 목록을 주문 순서대로 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def order_totals(products, orders):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', products)
    cur.executemany('INSERT INTO orders (id, product_id, quantity) VALUES (?, ?, ?)', orders)
    conn.commit()
    # TODO: orders와 products를 product_id 기준으로 JOIN해서,
    # (상품이름, 수량*가격) 튜플 리스트를 orders.id 순서로 반환하세요
    pass
`,
          assertion: `products = [(1, '마우스', 30000), (2, '키보드', 80000)]
orders = [(1, 1, 2), (2, 2, 1)]
assert order_totals(products, orders) == [('마우스', 60000), ('키보드', 80000)]`,
          hint: "SELECT products.name, orders.quantity * products.price FROM orders JOIN products ON orders.product_id = products.id ORDER BY orders.id 형태로 작성해보세요.",
          solutionCode: `import sqlite3

def order_totals(products, orders):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', products)
    cur.executemany('INSERT INTO orders (id, product_id, quantity) VALUES (?, ?, ?)', orders)
    conn.commit()
    cur.execute('''
        SELECT products.name, orders.quantity * products.price AS total
        FROM orders
        JOIN products ON orders.product_id = products.id
        ORDER BY orders.id
    ''')
    result = cur.fetchall()
    conn.close()
    return result
`,
          solutionExplain: 'SELECT 안에서 컬럼끼리 곱셈·덧셈 같은 계산을 바로 할 수 있어요. "수량 × 단가 = 주문금액"처럼, JOIN으로 연결한 여러 테이블의 값을 조합해 새로운 값을 계산하는 건 실무 쿼리에서 아주 흔합니다.',
        },
        {
          id: 'top_customers_by_spending',
          prompt: '주문 데이터에서 고객별 총 구매금액을 계산해, 가장 많이 쓴 상위 n명을 (고객명, 총금액) 순서로 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def top_customers_by_spending(products, orders, n):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, customer TEXT, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, price) VALUES (?, ?)', products)
    cur.executemany('INSERT INTO orders (product_id, customer, quantity) VALUES (?, ?, ?)', orders)
    conn.commit()
    # TODO: JOIN + GROUP BY customer로 고객별 총 구매금액(SUM)을 구하고,
    # ORDER BY 총금액 DESC LIMIT n 으로 상위 n명을 반환하세요
    pass
`,
          assertion: `products = [(1, 30000), (2, 80000)]
orders = [(1, '민준', 2), (2, '민준', 1), (1, '서연', 1), (2, '하은', 3)]
assert top_customers_by_spending(products, orders, 2) == [('하은', 240000), ('민준', 140000)]`,
          hint: 'JOIN, GROUP BY, ORDER BY, LIMIT을 한 쿼리에 순서대로 이어보세요: SUM(orders.quantity * products.price)로 총액을 구하고, GROUP BY orders.customer로 묶은 뒤, ORDER BY 총액 DESC LIMIT n.',
          solutionCode: `import sqlite3

def top_customers_by_spending(products, orders, n):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, customer TEXT, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, price) VALUES (?, ?)', products)
    cur.executemany('INSERT INTO orders (product_id, customer, quantity) VALUES (?, ?, ?)', orders)
    conn.commit()
    cur.execute('''
        SELECT orders.customer, SUM(orders.quantity * products.price) AS spent
        FROM orders
        JOIN products ON orders.product_id = products.id
        GROUP BY orders.customer
        ORDER BY spent DESC
        LIMIT ?
    ''', (n,))
    result = cur.fetchall()
    conn.close()
    return result
`,
          solutionExplain: 'JOIN으로 테이블을 연결하고, GROUP BY로 고객별로 묶고, ORDER BY + LIMIT으로 순위를 매기는 이 조합이 "우수 고객 Top N" 같은 실무 리포트 쿼리의 전형적인 형태예요.',
        },
        {
          id: 'sales_report',
          prompt: '전체 매출 요약 리포트를 만드는 함수를 완성하세요: 총 매출액, 매출이 가장 높은 카테고리, 구매한 고객 수를 딕셔너리로 반환합니다.',
          starterCode: `import sqlite3

def sales_report(products, orders):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, category TEXT, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, customer TEXT, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, category, price) VALUES (?, ?, ?)', products)
    cur.executemany('INSERT INTO orders (product_id, customer, quantity) VALUES (?, ?, ?)', orders)
    conn.commit()

    # TODO: 아래 세 가지를 각각 쿼리로 구해서
    # {'total_revenue': ..., 'top_category': ..., 'customer_count': ...} 형태로 반환하세요
    # 1) 전체 매출액 (SUM)
    # 2) 매출이 가장 높은 카테고리 (JOIN + GROUP BY + ORDER BY + LIMIT 1)
    # 3) 구매한 고객 수 (COUNT DISTINCT)
    pass
`,
          assertion: `products = [(1, '전자제품', 30000), (2, '전자제품', 80000), (3, '가구', 120000)]
orders = [(1, '민준', 2), (2, '서연', 1), (3, '민준', 1), (3, '하은', 1)]
result = sales_report(products, orders)
assert result == {'total_revenue': 380000, 'top_category': '가구', 'customer_count': 3}, f"결과: {result}"`,
          hint: '이 챕터에서 배운 세 가지 쿼리 패턴을 그대로 조합하면 돼요: SUM으로 총합, JOIN+GROUP BY+ORDER BY+LIMIT 1로 1등 찾기, COUNT(DISTINCT ...)로 고유 개수 세기.',
          solutionCode: `import sqlite3

def sales_report(products, orders):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, category TEXT, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, customer TEXT, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, category, price) VALUES (?, ?, ?)', products)
    cur.executemany('INSERT INTO orders (product_id, customer, quantity) VALUES (?, ?, ?)', orders)
    conn.commit()

    cur.execute('''
        SELECT SUM(orders.quantity * products.price)
        FROM orders JOIN products ON orders.product_id = products.id
    ''')
    total_revenue = cur.fetchone()[0]

    cur.execute('''
        SELECT products.category, SUM(orders.quantity * products.price) AS revenue
        FROM orders JOIN products ON orders.product_id = products.id
        GROUP BY products.category
        ORDER BY revenue DESC
        LIMIT 1
    ''')
    top_category = cur.fetchone()[0]

    cur.execute('SELECT COUNT(DISTINCT customer) FROM orders')
    customer_count = cur.fetchone()[0]

    conn.close()
    return {'total_revenue': total_revenue, 'top_category': top_category, 'customer_count': customer_count}
`,
          solutionExplain: '이 챕터의 결론이에요 — WHERE/ORDER BY/LIMIT로 원하는 데이터를 골라내고, GROUP BY/HAVING으로 그룹별 통계를 내고, JOIN으로 여러 테이블을 연결하는 것까지, SQL 조회의 핵심 도구를 한 리포트에 모두 녹여봤어요.',
        },
      ],
    },
  ],
}
