import type { ChapterContent } from '../types/chapter'

export const ormSqlalchemy: ChapterContent = {
  chapterId: '04_orm_sqlalchemy',
  pyodidePackages: ['sqlite3'],
  micropipPackages: ['sqlalchemy'],
  description:
    '지금까지는 SQL 문장을 직접 문자열로 작성해서 실행했어요. 이번엔 ORM(Object-Relational Mapping) 라이브러리인 SQLAlchemy로, 테이블을 파이썬 클래스로 정의하고 SQL 없이 파이썬 객체만으로 데이터베이스를 다뤄봅니다. 도서 목록 관리 프로그램으로 실습해요.',
  exampleCode: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

engine = create_engine('sqlite:///:memory:')
Base = declarative_base()

class Book(Base):
    __tablename__ = 'books'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    price = Column(Integer)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

session.add(Book(title='파이썬 입문', price=18000))
session.commit()

books = session.query(Book).all()
print([(b.title, b.price) for b in books])
`,
  tiers: [
    {
      key: 'beginner',
      label: '초급',
      exercises: [
        {
          id: 'create_and_count_books',
          prompt: 'Book 모델을 정의하고 도서 데이터를 추가한 뒤, 전체 도서 개수를 반환하는 함수를 완성하세요.',
          starterCode: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


def create_and_count_books(books_data):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        author = Column(String)
        price = Column(Integer)

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for title, author, price in books_data:
        session.add(Book(title=title, author=author, price=price))
    session.commit()
    # TODO: session.query(Book).count()로 전체 도서 개수를 반환하세요
    pass
`,
          assertion: `books_data = [('파이썬 입문', '김민준', 18000), ('데이터 분석 실전', '이서연', 25000)]
assert create_and_count_books(books_data) == 2`,
          hint: 'session.query(Book).count() 를 실행하면 Book 테이블의 전체 행 개수를 바로 얻을 수 있어요. SQL의 SELECT COUNT(*) FROM books와 같은 의미예요.',
          solutionCode: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


def create_and_count_books(books_data):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        author = Column(String)
        price = Column(Integer)

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for title, author, price in books_data:
        session.add(Book(title=title, author=author, price=price))
    session.commit()
    count = session.query(Book).count()
    session.close()
    return count
`,
          solutionExplain: 'class Book(Base): ... 처럼 파이썬 클래스로 테이블 구조를 정의하는 걸 "모델(model)"이라고 해요. session.add()로 객체를 추가하고 session.commit()으로 실제 저장하는 흐름이 SQLAlchemy ORM의 기본 패턴입니다.',
        },
        {
          id: 'filter_cheap_books',
          prompt: '가격이 max_price 이하인 도서 제목을, 저렴한 순서로 반환하는 함수를 완성하세요.',
          starterCode: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


def filter_cheap_books(books_data, max_price):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        author = Column(String)
        price = Column(Integer)

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for title, author, price in books_data:
        session.add(Book(title=title, author=author, price=price))
    session.commit()
    # TODO: session.query(Book).filter(Book.price <= max_price).order_by(Book.price)로
    # 조회해서 제목 리스트로 반환하세요
    pass
`,
          assertion: `books_data = [('파이썬 입문', '김민준', 18000), ('데이터 분석 실전', '이서연', 25000), ('SQL 기초', '박하은', 15000)]
assert filter_cheap_books(books_data, 20000) == ['SQL 기초', '파이썬 입문']`,
          hint: 'SQL의 WHERE/ORDER BY가 SQLAlchemy에서는 .filter(조건)와 .order_by(컬럼) 메서드로 바뀌어요. 체이닝(이어붙이기) 방식으로 .filter(...).order_by(...).all() 처럼 쓸 수 있습니다.',
          solutionCode: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


def filter_cheap_books(books_data, max_price):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        author = Column(String)
        price = Column(Integer)

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for title, author, price in books_data:
        session.add(Book(title=title, author=author, price=price))
    session.commit()
    results = session.query(Book).filter(Book.price <= max_price).order_by(Book.price).all()
    titles = [b.title for b in results]
    session.close()
    return titles
`,
          solutionExplain: 'SQL 문자열 대신 Book.price <= max_price 처럼 파이썬 코드로 조건을 표현할 수 있어요. 오타로 인한 SQL 문법 오류 위험이 줄고, 에디터의 자동완성 도움도 받을 수 있는 게 ORM의 큰 장점이에요.',
        },
        {
          id: 'get_book_title',
          prompt: 'id로 도서를 한 건 조회해서 제목을 반환하는 함수를 완성하세요.',
          starterCode: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


def get_book_title(books_data, book_id):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        author = Column(String)
        price = Column(Integer)

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for bid, title, author, price in books_data:
        session.add(Book(id=bid, title=title, author=author, price=price))
    session.commit()
    # TODO: session.get(Book, book_id)로 해당 id의 Book 객체를 가져와서
    # 그 객체의 title 속성을 반환하세요
    pass
`,
          assertion: `books_data = [(1, '파이썬 입문', '김민준', 18000), (2, '데이터 분석 실전', '이서연', 25000)]
assert get_book_title(books_data, 2) == '데이터 분석 실전'`,
          hint: 'session.get(Book, book_id)는 기본키(id)로 객체 하나를 바로 가져와요. 가져온 객체는 book.title, book.price처럼 속성으로 값을 꺼낼 수 있어요.',
          solutionCode: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


def get_book_title(books_data, book_id):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        author = Column(String)
        price = Column(Integer)

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for bid, title, author, price in books_data:
        session.add(Book(id=bid, title=title, author=author, price=price))
    session.commit()
    book = session.get(Book, book_id)
    title = book.title
    session.close()
    return title
`,
          solutionExplain: 'session.get()으로 가져온 book은 딕셔너리가 아니라 진짜 파이썬 객체예요. book.title, book.price처럼 점(.)으로 속성에 접근하는 게 raw SQL의 튜플 인덱싱보다 훨씬 읽기 편해요.',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'update_book_price',
          prompt: '도서 객체를 가져와서 가격 속성을 직접 바꾸고 저장한 뒤, 바뀐 가격을 반환하는 함수를 완성하세요.',
          starterCode: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


def update_book_price(books_data, book_id, new_price):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        price = Column(Integer)

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for bid, title, price in books_data:
        session.add(Book(id=bid, title=title, price=price))
    session.commit()
    # TODO: session.get으로 객체를 가져와서 book.price = new_price로 값을 바꾸고
    # session.commit()한 뒤, 다시 조회해서 바뀐 가격을 반환하세요
    pass
`,
          assertion: `books_data = [(1, '파이썬 입문', 18000), (2, '데이터 분석 실전', 25000)]
assert update_book_price(books_data, 1, 15000) == 15000`,
          hint: 'SQL의 UPDATE 문 없이, book = session.get(Book, book_id) 로 가져온 객체의 속성을 book.price = new_price처럼 그냥 바꿔주기만 하면 돼요. 이후 session.commit()이 실제 UPDATE를 실행해요.',
          solutionCode: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


def update_book_price(books_data, book_id, new_price):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        price = Column(Integer)

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for bid, title, price in books_data:
        session.add(Book(id=bid, title=title, price=price))
    session.commit()
    book = session.get(Book, book_id)
    book.price = new_price
    session.commit()
    updated = session.get(Book, book_id)
    result = updated.price
    session.close()
    return result
`,
          solutionExplain: 'ORM의 핵심 아이디어예요 — SQL의 UPDATE 문 없이, 파이썬 객체의 속성값을 바꾸기만 하면 SQLAlchemy가 알아서 "이 객체가 변경됐다"를 추적해서 commit 시점에 UPDATE 쿼리를 대신 만들어 실행해줘요.',
        },
        {
          id: 'delete_book',
          prompt: '도서 객체를 가져와서 삭제하고, 남은 도서 개수를 반환하는 함수를 완성하세요.',
          starterCode: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


def delete_book(books_data, book_id):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        price = Column(Integer)

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for bid, title, price in books_data:
        session.add(Book(id=bid, title=title, price=price))
    session.commit()
    # TODO: session.get으로 객체를 가져와서 session.delete(book)으로 삭제하고
    # commit한 뒤, 남은 도서 개수를 반환하세요
    pass
`,
          assertion: `books_data = [(1, '파이썬 입문', 18000), (2, '데이터 분석 실전', 25000), (3, 'SQL 기초', 15000)]
assert delete_book(books_data, 2) == 2`,
          hint: 'session.delete(book)에 객체를 넘기면 삭제 표시가 되고, session.commit()에서 실제 DELETE가 실행돼요.',
          solutionCode: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


def delete_book(books_data, book_id):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        price = Column(Integer)

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for bid, title, price in books_data:
        session.add(Book(id=bid, title=title, price=price))
    session.commit()
    book = session.get(Book, book_id)
    session.delete(book)
    session.commit()
    remaining = session.query(Book).count()
    session.close()
    return remaining
`,
          solutionExplain: 'session.add()로 추가, session.delete()로 삭제, 속성 변경으로 수정 — 이 세 가지가 SQLAlchemy ORM에서 데이터를 변경하는 전부예요. SQL 문장을 직접 쓰지 않아도 되는 게 ORM의 핵심 편의성입니다.',
        },
        {
          id: 'get_author_book_titles',
          prompt: 'Author와 Book을 관계(relationship)로 연결하고, 특정 저자가 쓴 책 제목들을 반환하는 함수를 완성하세요.',
          starterCode: `from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship


def get_author_book_titles(authors_data, books_data, author_name):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Author(Base):
        __tablename__ = 'authors'
        id = Column(Integer, primary_key=True)
        name = Column(String)
        books = relationship('Book', back_populates='author_rel')

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        author_id = Column(Integer, ForeignKey('authors.id'))
        author_rel = relationship('Author', back_populates='books')

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for aid, name in authors_data:
        session.add(Author(id=aid, name=name))
    session.commit()
    for title, author_id in books_data:
        session.add(Book(title=title, author_id=author_id))
    session.commit()

    # TODO: name이 author_name인 Author를 찾아서, author.books를 이용해
    # 그 저자가 쓴 책들의 제목 리스트를 반환하세요
    pass
`,
          assertion: `authors_data = [(1, '김민준'), (2, '이서연')]
books_data = [('파이썬 입문', 1), ('데이터 분석 실전', 1), ('SQL 기초', 2)]
assert get_author_book_titles(authors_data, books_data, '김민준') == ['파이썬 입문', '데이터 분석 실전']`,
          hint: "session.query(Author).filter(Author.name == author_name).first()로 저자를 찾은 뒤, author.books는 이미 그 저자가 쓴 Book 객체들의 리스트예요. [b.title for b in author.books]로 뽑아보세요.",
          solutionCode: `from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship


def get_author_book_titles(authors_data, books_data, author_name):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Author(Base):
        __tablename__ = 'authors'
        id = Column(Integer, primary_key=True)
        name = Column(String)
        books = relationship('Book', back_populates='author_rel')

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        author_id = Column(Integer, ForeignKey('authors.id'))
        author_rel = relationship('Author', back_populates='books')

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for aid, name in authors_data:
        session.add(Author(id=aid, name=name))
    session.commit()
    for title, author_id in books_data:
        session.add(Book(title=title, author_id=author_id))
    session.commit()

    author = session.query(Author).filter(Author.name == author_name).first()
    titles = [b.title for b in author.books]
    session.close()
    return titles
`,
          solutionExplain: 'relationship()은 외래키(ForeignKey)로 연결된 두 테이블을, 파이썬에서는 "author.books"처럼 자연스러운 객체 관계로 다룰 수 있게 해줘요. JOIN 쿼리를 직접 쓰지 않고도 연결된 데이터에 접근할 수 있는 게 ORM의 강력한 기능입니다.',
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'average_price_by_author',
          prompt: '저자별 평균 도서 가격을 {저자: 평균가격} 딕셔너리로 반환하는 함수를 완성하세요.',
          starterCode: `from sqlalchemy import create_engine, Column, Integer, String, func
from sqlalchemy.orm import declarative_base, sessionmaker


def average_price_by_author(books_data):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        author = Column(String)
        price = Column(Integer)

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for title, author, price in books_data:
        session.add(Book(title=title, author=author, price=price))
    session.commit()
    # TODO: session.query(Book.author, func.avg(Book.price)).group_by(Book.author)로
    # 조회해서 {저자: 평균가격} 딕셔너리로 반환하세요
    pass
`,
          assertion: `books_data = [('파이썬 입문', '김민준', 10000), ('중급 파이썬', '김민준', 20000), ('SQL 기초', '이서연', 15000)]
assert average_price_by_author(books_data) == {'김민준': 15000.0, '이서연': 15000.0}`,
          hint: 'SQL의 GROUP BY + AVG가 SQLAlchemy에서는 .group_by(컬럼)와 func.avg(컬럼)로 표현돼요. 결과를 dict(...)로 감싸면 바로 딕셔너리가 됩니다.',
          solutionCode: `from sqlalchemy import create_engine, Column, Integer, String, func
from sqlalchemy.orm import declarative_base, sessionmaker


def average_price_by_author(books_data):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        author = Column(String)
        price = Column(Integer)

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for title, author, price in books_data:
        session.add(Book(title=title, author=author, price=price))
    session.commit()
    result = session.query(Book.author, func.avg(Book.price)).group_by(Book.author).all()
    session.close()
    return dict(result)
`,
          solutionExplain: 'func는 SUM/AVG/COUNT 같은 SQL 집계함수를 파이썬 코드 안에서 쓸 수 있게 해줘요. Raw SQL의 GROUP BY 쿼리와 결과가 완전히 동일하지만, 파이썬 문법 안에서 자연스럽게 작성할 수 있어요.',
        },
        {
          id: 'books_by_author_name',
          prompt: 'Book과 Author를 JOIN해서, 특정 저자의 책 제목을 가나다 순으로 반환하는 함수를 완성하세요.',
          starterCode: `from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker


def books_by_author_name(authors_data, books_data, author_name):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Author(Base):
        __tablename__ = 'authors'
        id = Column(Integer, primary_key=True)
        name = Column(String)

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        author_id = Column(Integer, ForeignKey('authors.id'))

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for aid, name in authors_data:
        session.add(Author(id=aid, name=name))
    session.commit()
    for title, author_id in books_data:
        session.add(Book(title=title, author_id=author_id))
    session.commit()

    # TODO: session.query(Book).join(Author, Book.author_id == Author.id)로 조인하고
    # .filter(Author.name == author_name).order_by(Book.title)로 조회해서
    # 제목 리스트를 반환하세요
    pass
`,
          assertion: `authors_data = [(1, '김민준'), (2, '이서연')]
books_data = [('파이썬 입문', 1), ('SQL 기초', 2), ('중급 파이썬', 1)]
assert books_by_author_name(authors_data, books_data, '김민준') == ['중급 파이썬', '파이썬 입문']`,
          hint: '.join(Author, Book.author_id == Author.id)로 조인 조건을 명시한 뒤, .filter(...)와 .order_by(...)를 이어붙이세요. relationship 없이도 이렇게 명시적으로 JOIN할 수 있어요.',
          solutionCode: `from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker


def books_by_author_name(authors_data, books_data, author_name):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Author(Base):
        __tablename__ = 'authors'
        id = Column(Integer, primary_key=True)
        name = Column(String)

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        author_id = Column(Integer, ForeignKey('authors.id'))

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for aid, name in authors_data:
        session.add(Author(id=aid, name=name))
    session.commit()
    for title, author_id in books_data:
        session.add(Book(title=title, author_id=author_id))
    session.commit()

    results = (
        session.query(Book)
        .join(Author, Book.author_id == Author.id)
        .filter(Author.name == author_name)
        .order_by(Book.title)
        .all()
    )
    titles = [b.title for b in results]
    session.close()
    return titles
`,
          solutionExplain: 'relationship()이 미리 정의돼 있지 않아도, .join()에 조인 조건을 직접 써주면 SQL의 JOIN과 똑같이 동작해요. relationship은 편의기능이고, 필요하면 이렇게 명시적으로 조인할 수도 있다는 걸 기억하세요.',
        },
        {
          id: 'library_summary',
          prompt: '전체 도서관 요약 리포트를 만드는 함수를 완성하세요: 전체 도서 수, 전체 도서 가치(가격 합), 책을 가장 많이 쓴 저자를 딕셔너리로 반환합니다.',
          starterCode: `from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, func
from sqlalchemy.orm import declarative_base, sessionmaker


def library_summary(authors_data, books_data):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Author(Base):
        __tablename__ = 'authors'
        id = Column(Integer, primary_key=True)
        name = Column(String)

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        author_id = Column(Integer, ForeignKey('authors.id'))
        price = Column(Integer)

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for aid, name in authors_data:
        session.add(Author(id=aid, name=name))
    session.commit()
    for title, author_id, price in books_data:
        session.add(Book(title=title, author_id=author_id, price=price))
    session.commit()

    # TODO: 아래 세 가지를 구해서
    # {'total_books': ..., 'total_value': ..., 'top_author': ...} 형태로 반환하세요
    # 1) 전체 도서 수 (count)
    # 2) 전체 도서 가치 (func.sum(Book.price))
    # 3) 책을 가장 많이 쓴 저자 이름 (join + group_by + func.count + order_by desc + first)
    pass
`,
          assertion: `authors_data = [(1, '김민준'), (2, '이서연')]
books_data = [('파이썬 입문', 1, 10000), ('중급 파이썬', 1, 20000), ('SQL 기초', 2, 15000)]
result = library_summary(authors_data, books_data)
assert result == {'total_books': 3, 'total_value': 45000, 'top_author': '김민준'}, f"결과: {result}"`,
          hint: '이 챕터에서 배운 것들을 조합해보세요: session.query(Book).count()로 개수, session.query(func.sum(Book.price)).scalar()로 합계, Author와 Book을 join한 뒤 group_by(Author.name)로 묶고 func.count(Book.id)로 정렬해서 1등을 찾으세요.',
          solutionCode: `from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, func
from sqlalchemy.orm import declarative_base, sessionmaker


def library_summary(authors_data, books_data):
    engine = create_engine('sqlite:///:memory:')
    Base = declarative_base()

    class Author(Base):
        __tablename__ = 'authors'
        id = Column(Integer, primary_key=True)
        name = Column(String)

    class Book(Base):
        __tablename__ = 'books'
        id = Column(Integer, primary_key=True)
        title = Column(String)
        author_id = Column(Integer, ForeignKey('authors.id'))
        price = Column(Integer)

    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    for aid, name in authors_data:
        session.add(Author(id=aid, name=name))
    session.commit()
    for title, author_id, price in books_data:
        session.add(Book(title=title, author_id=author_id, price=price))
    session.commit()

    total_books = session.query(Book).count()
    total_value = session.query(func.sum(Book.price)).scalar()

    top_author = (
        session.query(Author.name, func.count(Book.id).label('cnt'))
        .join(Book, Book.author_id == Author.id)
        .group_by(Author.name)
        .order_by(func.count(Book.id).desc())
        .first()
    )

    session.close()
    return {'total_books': total_books, 'total_value': total_value, 'top_author': top_author[0]}
`,
          solutionExplain: '이 챕터의 결론이에요 — 모델 정의(class), 추가/수정/삭제(add·속성변경·delete), 조회 조건(filter·order_by), 관계(relationship), 집계(func.avg/func.sum/func.count)까지, SQLAlchemy ORM의 핵심 도구를 도서관 리포트 하나에 모두 녹여봤어요.',
        },
      ],
    },
  ],
}
