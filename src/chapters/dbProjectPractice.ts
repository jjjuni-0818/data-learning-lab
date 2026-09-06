import type { ChapterContent } from '../types/chapter'

export const dbProjectPractice: ChapterContent = {
  chapterId: '06_project_based_practice',
  pyodidePackages: ['sqlite3'],
  micropipPackages: ['mongomock'],
  description:
    '모듈3의 마지막 챕터예요. 실제 서비스는 보통 두 종류의 DB를 함께 써요 — 주문/결제처럼 구조가 딱 정해진 데이터는 관계형 DB(SQLite)에, 리뷰처럼 항목마다 필드가 다를 수 있는 유연한 데이터는 NoSQL(MongoDB)에 저장하죠. 온라인 서점을 예로, 주문 데이터는 SQLite로, 리뷰 데이터는 mongomock으로 관리하면서 두 데이터베이스를 연결해 분석하는 미니 프로젝트를 진행합니다.',
  exampleCode: `import sqlite3
import mongomock

# 주문 데이터는 SQLite(관계형)에
conn = sqlite3.connect(':memory:')
cur = conn.cursor()
cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
cur.execute("INSERT INTO products (id, name, price) VALUES (1, '파이썬 입문', 18000)")
conn.commit()

# 리뷰 데이터는 MongoDB(NoSQL)에 — 항목마다 필드가 달라도 괜찮아요
client = mongomock.MongoClient()
db = client['bookstore']
db.reviews.insert_many([
    {'product_id': 1, 'rating': 5, 'comment': '최고예요'},
    {'product_id': 1, 'rating': 4, 'comment': '좋아요', 'photo_url': 'img.png'},
])

cur.execute('SELECT name FROM products WHERE id = 1')
print(cur.fetchone()[0], '평균 별점:', db.reviews.count_documents({'product_id': 1}), '개 리뷰')
`,
  tiers: [
    {
      key: 'beginner',
      label: '초급',
      exercises: [
        {
          id: 'setup_orders_schema',
          prompt: '온라인 서점의 상품(products)·주문(orders) 테이블을 SQLite로 설계하고 데이터를 채운 뒤, 상품 수와 주문 수를 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def setup_orders_schema(products_data, orders_data):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
    cur.execute('''
        CREATE TABLE orders (
            id INTEGER PRIMARY KEY,
            product_id INTEGER,
            customer TEXT,
            quantity INTEGER,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    ''')
    cur.executemany('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', products_data)
    cur.executemany('INSERT INTO orders (id, product_id, customer, quantity) VALUES (?, ?, ?, ?)', orders_data)
    conn.commit()
    # TODO: products와 orders 각각의 행 개수를 세어
    # {'product_count': ..., 'order_count': ...} 딕셔너리로 반환하세요
    pass
`,
          assertion: `products_data = [(1, '파이썬 입문', 18000), (2, '데이터 분석 실전', 25000), (3, 'SQL 기초', 15000)]
orders_data = [(1, 1, '민준', 3), (2, 1, '서연', 2), (3, 2, '하은', 1), (4, 3, '도윤', 5), (5, 3, '민준', 2)]
assert setup_orders_schema(products_data, orders_data) == {'product_count': 3, 'order_count': 5}`,
          hint: "COUNT(*)를 두 번 실행하면 돼요 — SELECT COUNT(*) FROM products, SELECT COUNT(*) FROM orders. 이 챕터의 orders 테이블은 product_id로 products를 참조하는 외래키(FK) 구조예요.",
          solutionCode: `import sqlite3

def setup_orders_schema(products_data, orders_data):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
    cur.execute('''
        CREATE TABLE orders (
            id INTEGER PRIMARY KEY,
            product_id INTEGER,
            customer TEXT,
            quantity INTEGER,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    ''')
    cur.executemany('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', products_data)
    cur.executemany('INSERT INTO orders (id, product_id, customer, quantity) VALUES (?, ?, ?, ?)', orders_data)
    conn.commit()
    cur.execute('SELECT COUNT(*) FROM products')
    product_count = cur.fetchone()[0]
    cur.execute('SELECT COUNT(*) FROM orders')
    order_count = cur.fetchone()[0]
    conn.close()
    return {'product_count': product_count, 'order_count': order_count}
`,
          solutionExplain: '이 프로젝트의 관계형 DB 쪽 뼈대예요. 상품과 주문처럼 "정해진 구조를 가지고, 서로 참조 관계가 있는" 데이터는 관계형 DB(테이블+외래키)에 저장하는 게 자연스러워요.',
        },
        {
          id: 'insert_reviews_documents',
          prompt: '상품 리뷰 데이터를 mongomock의 reviews 컬렉션에 저장하고, 전체 리뷰 개수를 반환하는 함수를 완성하세요. (일부 리뷰에만 photo_url 필드가 있어요)',
          starterCode: `import mongomock

def insert_reviews_documents(reviews):
    client = mongomock.MongoClient()
    db = client['bookstore']
    db.reviews.insert_many(reviews)
    # TODO: count_documents({})로 전체 리뷰 개수를 반환하세요
    pass
`,
          assertion: `reviews = [
    {'product_id': 1, 'customer': '민준', 'rating': 5, 'comment': '최고예요'},
    {'product_id': 1, 'customer': '서연', 'rating': 5, 'comment': '완벽해요'},
    {'product_id': 2, 'customer': '하은', 'rating': 3, 'comment': '그저그래요'},
    {'product_id': 3, 'customer': '도윤', 'rating': 4, 'comment': '좋아요', 'photo_url': 'img1.png'},
    {'product_id': 3, 'customer': '민준', 'rating': 4, 'comment': '괜찮아요'},
]
assert insert_reviews_documents(reviews) == 5`,
          hint: 'db.reviews.count_documents({})로 컬렉션 전체 문서 개수를 셀 수 있어요. 리뷰마다 photo_url 필드가 있거나 없거나 상관없이 insert_many가 그대로 저장해줘요 — 이게 NoSQL의 스키마 유연성이에요.',
          solutionCode: `import mongomock

def insert_reviews_documents(reviews):
    client = mongomock.MongoClient()
    db = client['bookstore']
    db.reviews.insert_many(reviews)
    return db.reviews.count_documents({})
`,
          solutionExplain: '이 프로젝트의 NoSQL 쪽 뼈대예요. 리뷰처럼 "항목마다 있을 수도, 없을 수도 있는 필드(사진 첨부 여부 등)"가 있는 데이터는, 미리 컬럼을 다 정해둬야 하는 관계형 테이블보다 문서(document) 구조가 더 잘 어울려요.',
        },
        {
          id: 'top_selling_products',
          prompt: '가장 많이 팔린 상품 상위 n개의 이름을 반환하는 함수를 완성하세요. (SQLite JOIN + GROUP BY 활용)',
          starterCode: `import sqlite3

def top_selling_products(products_data, orders_data, n):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, customer TEXT, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', products_data)
    cur.executemany('INSERT INTO orders (id, product_id, customer, quantity) VALUES (?, ?, ?, ?)', orders_data)
    conn.commit()
    # TODO: orders와 products를 JOIN하고 GROUP BY products.name으로 묶어
    # SUM(orders.quantity)이 큰 순서로 정렬해서 상위 n개 이름을 반환하세요
    pass
`,
          assertion: `products_data = [(1, '파이썬 입문', 18000), (2, '데이터 분석 실전', 25000), (3, 'SQL 기초', 15000)]
orders_data = [(1, 1, '민준', 3), (2, 1, '서연', 2), (3, 2, '하은', 1), (4, 3, '도윤', 5), (5, 3, '민준', 2)]
assert top_selling_products(products_data, orders_data, 2) == ['SQL 기초', '파이썬 입문']`,
          hint: '모듈3 챕터2에서 배운 패턴을 그대로 써보세요: JOIN으로 연결 → GROUP BY로 묶고 → SUM으로 합산 → ORDER BY DESC LIMIT n.',
          solutionCode: `import sqlite3

def top_selling_products(products_data, orders_data, n):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, customer TEXT, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', products_data)
    cur.executemany('INSERT INTO orders (id, product_id, customer, quantity) VALUES (?, ?, ?, ?)', orders_data)
    conn.commit()
    cur.execute('''
        SELECT products.name, SUM(orders.quantity) AS total
        FROM orders JOIN products ON orders.product_id = products.id
        GROUP BY products.name
        ORDER BY total DESC
        LIMIT ?
    ''', (n,))
    result = [row[0] for row in cur.fetchall()]
    conn.close()
    return result
`,
          solutionExplain: '앞선 챕터들에서 배운 JOIN+GROUP BY+ORDER BY+LIMIT 조합을 그대로 재사용했어요. "베스트셀러"처럼 실제 서비스에서도 매우 자주 필요한 집계예요.',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'average_rating_by_product',
          prompt: '상품별 평균 별점을 {product_id: 평균별점} 딕셔너리로 반환하는 함수를 완성하세요. (mongomock aggregate 활용)',
          starterCode: `import mongomock

def average_rating_by_product(reviews):
    client = mongomock.MongoClient()
    db = client['bookstore']
    db.reviews.insert_many(reviews)
    # TODO: aggregate([{'$group': {'_id': '$product_id', 'avg_rating': {'$avg': '$rating'}}}])로
    # 상품별 평균 별점을 구해서 {product_id: 평균별점} 딕셔너리로 반환하세요
    pass
`,
          assertion: `reviews = [
    {'product_id': 1, 'customer': '민준', 'rating': 5, 'comment': '최고예요'},
    {'product_id': 1, 'customer': '서연', 'rating': 5, 'comment': '완벽해요'},
    {'product_id': 2, 'customer': '하은', 'rating': 3, 'comment': '그저그래요'},
    {'product_id': 3, 'customer': '도윤', 'rating': 4, 'comment': '좋아요', 'photo_url': 'img1.png'},
    {'product_id': 3, 'customer': '민준', 'rating': 4, 'comment': '괜찮아요'},
]
assert average_rating_by_product(reviews) == {1: 5.0, 2: 3.0, 3: 4.0}`,
          hint: '모듈3 챕터5에서 배운 $group + $avg 패턴을 그대로 쓰면 돼요. 결과의 각 문서는 _id가 product_id, avg_rating이 평균값이에요.',
          solutionCode: `import mongomock

def average_rating_by_product(reviews):
    client = mongomock.MongoClient()
    db = client['bookstore']
    db.reviews.insert_many(reviews)
    pipeline = [
        {'$group': {'_id': '$product_id', 'avg_rating': {'$avg': '$rating'}}}
    ]
    results = db.reviews.aggregate(pipeline)
    return {doc['_id']: doc['avg_rating'] for doc in results}
`,
          solutionExplain: 'SQLite의 GROUP BY + AVG와 개념이 완전히 같아요. 다만 리뷰 데이터가 NoSQL에 있으니, 집계도 mongomock의 aggregate로 처리하는 거예요.',
        },
        {
          id: 'customer_order_history',
          prompt: '특정 고객이 주문한 상품 이름과 수량을, 주문 순서대로 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def customer_order_history(products_data, orders_data, customer_name):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, customer TEXT, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', products_data)
    cur.executemany('INSERT INTO orders (id, product_id, customer, quantity) VALUES (?, ?, ?, ?)', orders_data)
    conn.commit()
    # TODO: orders와 products를 JOIN하고 WHERE orders.customer = ? 조건으로 조회해서
    # (상품이름, 수량) 튜플 리스트를 orders.id 순서로 반환하세요
    pass
`,
          assertion: `products_data = [(1, '파이썬 입문', 18000), (2, '데이터 분석 실전', 25000), (3, 'SQL 기초', 15000)]
orders_data = [(1, 1, '민준', 3), (2, 1, '서연', 2), (3, 2, '하은', 1), (4, 3, '도윤', 5), (5, 3, '민준', 2)]
assert customer_order_history(products_data, orders_data, '민준') == [('파이썬 입문', 3), ('SQL 기초', 2)]`,
          hint: 'JOIN한 결과에 WHERE로 특정 고객만 걸러내고, ORDER BY orders.id로 주문한 순서를 유지하세요.',
          solutionCode: `import sqlite3

def customer_order_history(products_data, orders_data, customer_name):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, customer TEXT, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', products_data)
    cur.executemany('INSERT INTO orders (id, product_id, customer, quantity) VALUES (?, ?, ?, ?)', orders_data)
    conn.commit()
    cur.execute('''
        SELECT products.name, orders.quantity
        FROM orders JOIN products ON orders.product_id = products.id
        WHERE orders.customer = ?
        ORDER BY orders.id
    ''', (customer_name,))
    result = cur.fetchall()
    conn.close()
    return result
`,
          solutionExplain: '"마이페이지 > 주문내역"처럼, 실제 쇼핑몰에서 가장 많이 쓰이는 조회 중 하나예요. JOIN + WHERE + ORDER BY를 조합하는 감각을 다시 한번 확인하는 문제였어요.',
        },
        {
          id: 'reduce_stock_with_rollback',
          prompt: '상품 재고를 판매 수량만큼 줄이되, 재고가 부족하면 반영하지 않고(rollback) 원래 재고를 유지하는 함수를 완성하세요.',
          starterCode: `import sqlite3

def reduce_stock_with_rollback(products_with_stock, product_id, quantity_to_sell):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER)')
    cur.executemany('INSERT INTO products (id, name, stock) VALUES (?, ?, ?)', products_with_stock)
    conn.commit()
    # TODO: 현재 재고 - quantity_to_sell을 계산해서, 음수면 ValueError를 발생시키고
    # except에서 conn.rollback()한 뒤 원래 재고를 반환하세요.
    # 음수가 아니면 UPDATE로 반영하고 commit한 뒤 새 재고를 반환하세요.
    pass
`,
          assertion: `products_with_stock = [(1, '파이썬 입문', 10)]
assert reduce_stock_with_rollback(products_with_stock, 1, 4) == 6
assert reduce_stock_with_rollback(products_with_stock, 1, 100) == 10`,
          hint: '모듈3 챕터3에서 배운 adjust_stock_safely 패턴과 완전히 같아요: try에서 계산+검증+UPDATE+commit, except ValueError에서 rollback+원래 값 재조회.',
          solutionCode: `import sqlite3

def reduce_stock_with_rollback(products_with_stock, product_id, quantity_to_sell):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, stock INTEGER)')
    cur.executemany('INSERT INTO products (id, name, stock) VALUES (?, ?, ?)', products_with_stock)
    conn.commit()
    try:
        cur.execute('SELECT stock FROM products WHERE id = ?', (product_id,))
        current = cur.fetchone()[0]
        new_stock = current - quantity_to_sell
        if new_stock < 0:
            raise ValueError('재고가 부족합니다')
        cur.execute('UPDATE products SET stock = ? WHERE id = ?', (new_stock, product_id))
        conn.commit()
        result = new_stock
    except ValueError:
        conn.rollback()
        cur.execute('SELECT stock FROM products WHERE id = ?', (product_id,))
        result = cur.fetchone()[0]
    conn.close()
    return result
`,
          solutionExplain: '주문이 들어올 때마다 재고를 안전하게 줄이는 로직이에요. "주문 수량이 재고보다 많으면 주문을 거부"하는 실제 쇼핑몰의 핵심 비즈니스 로직을, 트랜잭션 rollback으로 구현했어요.',
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'bestseller_with_rating',
          prompt: '가장 많이 팔린 상품을 찾고(SQLite), 그 상품의 평균 별점을(mongomock) 함께 조회해서 반환하는 함수를 완성하세요. 이 챕터의 핵심인 "두 데이터베이스 연결"을 처음으로 직접 해보는 문제예요.',
          starterCode: `import sqlite3
import mongomock

def bestseller_with_rating(products_data, orders_data, reviews):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, customer TEXT, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', products_data)
    cur.executemany('INSERT INTO orders (id, product_id, customer, quantity) VALUES (?, ?, ?, ?)', orders_data)
    conn.commit()

    # TODO 1: JOIN+GROUP BY products.id로 가장 많이 팔린 상품의
    # (id, name, 총판매량)을 조회하세요 (ORDER BY total DESC LIMIT 1)
    # best_id, best_name, total_sold = ...
    conn.close()

    # TODO 2: mongomock에 reviews를 넣고, {'$match': {'product_id': best_id}}로
    # 그 상품의 리뷰만 골라 $group+$avg로 평균 별점을 구하세요
    # avg_rating = ...

    # TODO 3: {'product': best_name, 'total_sold': total_sold, 'avg_rating': avg_rating} 반환
    pass
`,
          assertion: `products_data = [(1, '파이썬 입문', 18000), (2, '데이터 분석 실전', 25000), (3, 'SQL 기초', 15000)]
orders_data = [(1, 1, '민준', 3), (2, 1, '서연', 2), (3, 2, '하은', 1), (4, 3, '도윤', 5), (5, 3, '민준', 2)]
reviews = [
    {'product_id': 1, 'customer': '민준', 'rating': 5, 'comment': '최고예요'},
    {'product_id': 1, 'customer': '서연', 'rating': 5, 'comment': '완벽해요'},
    {'product_id': 2, 'customer': '하은', 'rating': 3, 'comment': '그저그래요'},
    {'product_id': 3, 'customer': '도윤', 'rating': 4, 'comment': '좋아요', 'photo_url': 'img1.png'},
    {'product_id': 3, 'customer': '민준', 'rating': 4, 'comment': '괜찮아요'},
]
result = bestseller_with_rating(products_data, orders_data, reviews)
assert result == {'product': 'SQL 기초', 'total_sold': 7, 'avg_rating': 4.0}, f"결과: {result}"`,
          hint: 'SQLite 쪽에서 얻은 best_id(상품 id)를 그대로 mongomock 쪽 쿼리의 product_id 조건으로 넘기면 돼요. 이게 "두 데이터베이스를 공유 id로 연결한다"는 뜻이에요.',
          solutionCode: `import sqlite3
import mongomock

def bestseller_with_rating(products_data, orders_data, reviews):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, customer TEXT, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', products_data)
    cur.executemany('INSERT INTO orders (id, product_id, customer, quantity) VALUES (?, ?, ?, ?)', orders_data)
    conn.commit()
    cur.execute('''
        SELECT products.id, products.name, SUM(orders.quantity) AS total
        FROM orders JOIN products ON orders.product_id = products.id
        GROUP BY products.id
        ORDER BY total DESC
        LIMIT 1
    ''')
    best_id, best_name, total_sold = cur.fetchone()
    conn.close()

    client = mongomock.MongoClient()
    db = client['bookstore']
    db.reviews.insert_many(reviews)
    pipeline = [
        {'$match': {'product_id': best_id}},
        {'$group': {'_id': '$product_id', 'avg_rating': {'$avg': '$rating'}}},
    ]
    result = list(db.reviews.aggregate(pipeline))
    avg_rating = result[0]['avg_rating']

    return {'product': best_name, 'total_sold': total_sold, 'avg_rating': avg_rating}
`,
          solutionExplain: '이게 바로 "폴리글랏 퍼시스턴스(polyglot persistence)" — 서로 다른 두 데이터베이스를 공통 id(product_id)로 이어서 하나의 결과로 합치는 실전 패턴이에요. 실제 서비스에서도 주문 DB와 리뷰 DB가 물리적으로 다른 시스템인 경우가 흔해요.',
        },
        {
          id: 'products_needing_attention',
          prompt: '많이 팔렸는데(min_sales 이상) 평균 별점은 낮은(max_rating 이하) "관리가 필요한 상품" 이름을 반환하는 함수를 완성하세요.',
          starterCode: `import sqlite3
import mongomock

def products_needing_attention(products_data, orders_data, reviews, min_sales, max_rating):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, customer TEXT, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', products_data)
    cur.executemany('INSERT INTO orders (id, product_id, customer, quantity) VALUES (?, ?, ?, ?)', orders_data)
    conn.commit()
    # TODO 1: JOIN+GROUP BY+HAVING total >= min_sales 로 "많이 팔린 상품"들의
    # {id: name} 딕셔너리를 만드세요 (popular)
    conn.close()

    # TODO 2: mongomock aggregate로 상품별 평균 별점 {product_id: 평균} 딕셔너리를 만드세요 (ratings)

    # TODO 3: popular 중에서 ratings.get(id, 0) <= max_rating인 상품 이름만
    # 정렬된 리스트로 반환하세요
    pass
`,
          assertion: `products_data = [(1, '파이썬 입문', 18000), (2, '데이터 분석 실전', 25000), (3, 'SQL 기초', 15000)]
orders_data = [(1, 1, '민준', 3), (2, 1, '서연', 2), (3, 2, '하은', 1), (4, 3, '도윤', 5), (5, 3, '민준', 2)]
reviews = [
    {'product_id': 1, 'customer': '민준', 'rating': 5, 'comment': '최고예요'},
    {'product_id': 1, 'customer': '서연', 'rating': 5, 'comment': '완벽해요'},
    {'product_id': 2, 'customer': '하은', 'rating': 3, 'comment': '그저그래요'},
    {'product_id': 3, 'customer': '도윤', 'rating': 4, 'comment': '좋아요', 'photo_url': 'img1.png'},
    {'product_id': 3, 'customer': '민준', 'rating': 4, 'comment': '괜찮아요'},
]
assert products_needing_attention(products_data, orders_data, reviews, 5, 4.5) == ['SQL 기초']`,
          hint: 'HAVING total >= ? 로 "많이 팔린 상품"만 먼저 걸러내고, 그 상품들만 mongomock 평균 별점과 비교하세요. 두 결과를 파이썬의 딕셔너리 조회(.get())로 연결하면 돼요.',
          solutionCode: `import sqlite3
import mongomock

def products_needing_attention(products_data, orders_data, reviews, min_sales, max_rating):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, customer TEXT, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', products_data)
    cur.executemany('INSERT INTO orders (id, product_id, customer, quantity) VALUES (?, ?, ?, ?)', orders_data)
    conn.commit()
    cur.execute('''
        SELECT products.id, products.name, SUM(orders.quantity) AS total
        FROM orders JOIN products ON orders.product_id = products.id
        GROUP BY products.id
        HAVING total >= ?
    ''', (min_sales,))
    popular = {row[0]: row[1] for row in cur.fetchall()}
    conn.close()

    client = mongomock.MongoClient()
    db = client['bookstore']
    db.reviews.insert_many(reviews)
    pipeline = [
        {'$group': {'_id': '$product_id', 'avg_rating': {'$avg': '$rating'}}}
    ]
    ratings = {doc['_id']: doc['avg_rating'] for doc in db.reviews.aggregate(pipeline)}

    result = sorted(
        name for pid, name in popular.items()
        if ratings.get(pid, 0) <= max_rating
    )
    return result
`,
          solutionExplain: '"인기는 많은데 평점은 낮은 상품"을 찾는 건 실제 이커머스 운영팀이 매일 확인하는 리포트예요. 판매 데이터(SQLite)와 평점 데이터(MongoDB)를 각각 조회한 뒤, 파이썬 코드로 두 결과를 조합해서 새로운 인사이트를 만들어낸 거예요.',
        },
        {
          id: 'full_store_report',
          prompt: '서점 전체 요약 리포트를 만드는 함수를 완성하세요: 총매출, 베스트셀러, 평점이 가장 높은 상품, 전체 리뷰 수를 한 번에 반환합니다. 모듈3 전체(SQLite+ORM 개념+mongomock)를 종합하는 최종 문제예요.',
          starterCode: `import sqlite3
import mongomock

def full_store_report(products_data, orders_data, reviews):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, customer TEXT, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', products_data)
    cur.executemany('INSERT INTO orders (id, product_id, customer, quantity) VALUES (?, ?, ?, ?)', orders_data)
    conn.commit()

    # TODO 1: 총매출 (SUM(orders.quantity * products.price))
    # total_revenue = ...

    # TODO 2: 베스트셀러 상품 이름 (JOIN+GROUP BY+ORDER BY SUM(quantity) DESC LIMIT 1)
    # bestseller = ...

    # TODO 3: {id: name} 딕셔너리도 하나 만들어두세요 (mongomock 결과와 이름을 이어붙일 때 필요해요)
    # product_names = ...

    conn.close()

    # TODO 4: mongomock에 reviews를 넣고, 상품별 평균 별점을 구해서
    # 가장 평점이 높은 상품 이름을 찾으세요
    # (aggregate에 $sort와 $limit을 추가로 써보세요: {'$sort': {'avg_rating': -1}}, {'$limit': 1})
    # top_rated_product = ...

    # TODO 5: 전체 리뷰 개수
    # total_reviews = ...

    # TODO 6: 아래 형태로 반환하세요
    # {'total_revenue': ..., 'bestseller': ..., 'top_rated_product': ..., 'total_reviews': ...}
    pass
`,
          assertion: `products_data = [(1, '파이썬 입문', 18000), (2, '데이터 분석 실전', 25000), (3, 'SQL 기초', 15000)]
orders_data = [(1, 1, '민준', 3), (2, 1, '서연', 2), (3, 2, '하은', 1), (4, 3, '도윤', 5), (5, 3, '민준', 2)]
reviews = [
    {'product_id': 1, 'customer': '민준', 'rating': 5, 'comment': '최고예요'},
    {'product_id': 1, 'customer': '서연', 'rating': 5, 'comment': '완벽해요'},
    {'product_id': 2, 'customer': '하은', 'rating': 3, 'comment': '그저그래요'},
    {'product_id': 3, 'customer': '도윤', 'rating': 4, 'comment': '좋아요', 'photo_url': 'img1.png'},
    {'product_id': 3, 'customer': '민준', 'rating': 4, 'comment': '괜찮아요'},
]
result = full_store_report(products_data, orders_data, reviews)
assert result == {
    'total_revenue': 220000,
    'bestseller': 'SQL 기초',
    'top_rated_product': '파이썬 입문',
    'total_reviews': 5,
}, f"결과: {result}"`,
          hint: 'aggregate 파이프라인에 여러 단계를 순서대로 이어붙일 수 있어요: [{"$group": ...}, {"$sort": {"avg_rating": -1}}, {"$limit": 1}] 처럼 리스트에 단계를 추가하면 "그룹으로 묶고 → 평점 높은 순 정렬 → 1등만 남기기"가 순서대로 실행돼요. 결과의 _id(product_id)를 product_names 딕셔너리로 이름으로 바꿔주세요.',
          solutionCode: `import sqlite3
import mongomock

def full_store_report(products_data, orders_data, reviews):
    conn = sqlite3.connect(':memory:')
    cur = conn.cursor()
    cur.execute('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)')
    cur.execute('CREATE TABLE orders (id INTEGER PRIMARY KEY, product_id INTEGER, customer TEXT, quantity INTEGER)')
    cur.executemany('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', products_data)
    cur.executemany('INSERT INTO orders (id, product_id, customer, quantity) VALUES (?, ?, ?, ?)', orders_data)
    conn.commit()

    cur.execute('''
        SELECT SUM(orders.quantity * products.price)
        FROM orders JOIN products ON orders.product_id = products.id
    ''')
    total_revenue = cur.fetchone()[0]

    cur.execute('''
        SELECT products.name
        FROM orders JOIN products ON orders.product_id = products.id
        GROUP BY products.id
        ORDER BY SUM(orders.quantity) DESC
        LIMIT 1
    ''')
    bestseller = cur.fetchone()[0]

    cur.execute('SELECT id, name FROM products')
    product_names = dict(cur.fetchall())
    conn.close()

    client = mongomock.MongoClient()
    db = client['bookstore']
    db.reviews.insert_many(reviews)
    pipeline = [
        {'$group': {'_id': '$product_id', 'avg_rating': {'$avg': '$rating'}}},
        {'$sort': {'avg_rating': -1}},
        {'$limit': 1},
    ]
    top = list(db.reviews.aggregate(pipeline))[0]
    top_rated_product = product_names[top['_id']]

    total_reviews = db.reviews.count_documents({})

    return {
        'total_revenue': total_revenue,
        'bestseller': bestseller,
        'top_rated_product': top_rated_product,
        'total_reviews': total_reviews,
    }
`,
          solutionExplain: '모듈3 전체의 결론이에요 — 테이블/키(챕터1), SQL 조회(챕터2), Python 연동+트랜잭션(챕터3), ORM(챕터4), NoSQL(챕터5)까지 배운 걸 모두 동원해서, "관계형 DB(정형 데이터)와 NoSQL(비정형 데이터)을 함께 쓰는 실제 서비스"의 축소판을 완성했어요. 베스트셀러(SQLite)와 최고 평점(MongoDB)이 다른 상품이라는 것도 실제로 자주 있는 일이에요 — 많이 팔린다고 꼭 만족도가 가장 높은 건 아니거든요.',
        },
      ],
    },
  ],
}
