import type { ChapterContent } from '../types/chapter'

export const dataframeBasics: ChapterContent = {
  chapterId: '01_dataframe_basics',
  description:
    '여러 개의 행(row)과 열(column)로 이루어진, 표 형태의 데이터 구조예요. 우리가 엑셀에서 늘 보던 표와 똑같이 생겼어요.',
  exampleCode: `import pandas as pd

data = {'이름': ['민준', '서연', '하은'], '나이': [17, 16, 17], '점수': [88, 92, 79]}
df = pd.DataFrame(data)
print(df.head())
`,
  tiers: [
    {
      key: 'beginner',
      label: '초급',
      exercises: [
        {
          id: 'count_rows',
          prompt: '주어진 데이터로 DataFrame을 만들고, 전체 행의 개수를 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def count_rows(data):
    df = pd.DataFrame(data)
    # TODO: 행의 개수를 반환하세요
    pass
`,
          assertion: `assert count_rows({'이름': ['민준', '서연', '하은'], '나이': [17, 16, 17]}) == 3`,
          hint: 'DataFrame의 행 개수는 len(df) 또는 df.shape[0]로 구할 수 있어요.',
          solutionCode: `import pandas as pd

def count_rows(data):
    df = pd.DataFrame(data)
    return len(df)
`,
          solutionExplain: 'len(df)는 DataFrame의 행 개수를 반환합니다. df.shape[0]도 같은 값을 줘요.',
        },
        {
          id: 'get_columns',
          prompt: 'DataFrame의 컬럼(열) 이름들을 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def get_columns(data):
    df = pd.DataFrame(data)
    # TODO: 컬럼 이름들을 리스트로 반환하세요
    pass
`,
          assertion: `result = get_columns({'이름': ['민준'], '나이': [17]})
assert list(result) == ['이름', '나이'], f"결과: {list(result)}"`,
          hint: 'df.columns 로 컬럼 이름을 가져올 수 있어요. list()로 감싸면 리스트가 돼요.',
          solutionCode: `import pandas as pd

def get_columns(data):
    df = pd.DataFrame(data)
    return list(df.columns)
`,
          solutionExplain: 'df.columns는 Index 객체를 반환하는데, list()로 감싸면 일반 리스트로 바꿀 수 있어요.',
        },
        {
          id: 'get_column_values',
          prompt: '지정한 컬럼(column_name)의 값을 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def get_column_values(data, column_name):
    df = pd.DataFrame(data)
    # TODO: column_name 컬럼의 값을 리스트로 반환하세요
    pass
`,
          assertion: `result = get_column_values({'이름': ['민준', '서연'], '나이': [17, 16]}, '나이')
assert list(result) == [17, 16], f"결과: {list(result)}"`,
          hint: "df['컬럼이름']으로 그 컬럼만 뽑아낼 수 있고, .tolist()로 리스트로 바꿀 수 있어요.",
          solutionCode: `import pandas as pd

def get_column_values(data, column_name):
    df = pd.DataFrame(data)
    return df[column_name].tolist()
`,
          solutionExplain: 'df[column_name]은 그 컬럼만 Series로 뽑아내고, tolist()는 이를 파이썬 리스트로 변환합니다.',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'filter_by_age',
          prompt: '나이가 min_age 이상인 사람의 이름만 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def filter_by_age(data, min_age):
    df = pd.DataFrame(data)
    # TODO: min_age 이상인 사람의 '이름' 컬럼 값을 리스트로 반환하세요
    pass
`,
          assertion: `result = filter_by_age({'이름': ['민준', '서연', '하은'], '나이': [17, 16, 17]}, 17)
assert list(result) == ['민준', '하은'], f"결과: {list(result)}"`,
          hint: "df[df['나이'] >= min_age] 로 조건에 맞는 행만 걸러낸 뒤, ['이름'] 컬럼을 리스트로 바꿔보세요 (.tolist()).",
          solutionCode: `import pandas as pd

def filter_by_age(data, min_age):
    df = pd.DataFrame(data)
    return df[df['나이'] >= min_age]['이름'].tolist()
`,
          solutionExplain: "조건식 df['나이'] >= min_age 은 True/False로 이루어진 조건을 만들고, df[조건]으로 그 조건에 맞는 행만 걸러냅니다.",
        },
        {
          id: 'add_score_grade',
          prompt: "점수(점수 컬럼)가 90 이상이면 'A', 아니면 'B'인 등급을 매겨서, 등급 리스트를 반환하는 함수를 완성하세요.",
          starterCode: `import pandas as pd

def add_score_grade(data):
    df = pd.DataFrame(data)
    # TODO: 점수가 90 이상이면 'A', 아니면 'B'인 등급을 매겨서
    # 등급 값들을 리스트로 반환하세요
    pass
`,
          assertion: `result = add_score_grade({'점수': [95, 80, 92]})
assert list(result) == ['A', 'B', 'A'], f"결과: {list(result)}"`,
          hint: "df['점수'].apply(lambda x: 'A' if x >= 90 else 'B') 처럼 apply와 조건문을 활용해보세요.",
          solutionCode: `import pandas as pd

def add_score_grade(data):
    df = pd.DataFrame(data)
    df['등급'] = df['점수'].apply(lambda x: 'A' if x >= 90 else 'B')
    return df['등급'].tolist()
`,
          solutionExplain: 'apply()는 컬럼의 각 값에 함수를 적용합니다. 조건에 따라 다른 값을 매기는 데 자주 쓰여요.',
        },
        {
          id: 'sort_by_score',
          prompt: '점수가 높은 순서대로 정렬했을 때의 이름 리스트를 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def sort_by_score(data):
    df = pd.DataFrame(data)
    # TODO: 점수 기준 내림차순 정렬 후 이름 리스트를 반환하세요
    pass
`,
          assertion: `result = sort_by_score({'이름': ['민준', '서연', '하은'], '점수': [88, 92, 79]})
assert list(result) == ['서연', '민준', '하은'], f"결과: {list(result)}"`,
          hint: "df.sort_values('점수', ascending=False)로 내림차순 정렬할 수 있어요.",
          solutionCode: `import pandas as pd

def sort_by_score(data):
    df = pd.DataFrame(data)
    sorted_df = df.sort_values('점수', ascending=False)
    return sorted_df['이름'].tolist()
`,
          solutionExplain: 'sort_values는 특정 컬럼 기준으로 행 순서를 정렬합니다. ascending=False는 내림차순이에요.',
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'average_age_excluding_missing',
          prompt: '나이 데이터에 결측치(비어있는 값)가 있을 수 있습니다. 결측치를 제외하고 평균 나이를 구하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def average_age_excluding_missing(data):
    df = pd.DataFrame(data)
    # TODO: '나이' 컬럼의 결측치를 제외하고 평균을 반환하세요
    pass
`,
          assertion: `result = average_age_excluding_missing({'나이': [17, 16, None, 17]})
assert abs(result - 16.666666666666668) < 0.01, f"결과: {result}"`,
          hint: 'df["나이"].mean()은 기본적으로 결측치(NaN)를 자동으로 제외하고 평균을 계산해줘요.',
          solutionCode: `import pandas as pd

def average_age_excluding_missing(data):
    df = pd.DataFrame(data)
    return df['나이'].mean()
`,
          solutionExplain: 'pandas의 mean()은 기본값으로 결측치를 자동으로 제외(skipna=True)하고 평균을 계산합니다.',
        },
        {
          id: 'group_average_score',
          prompt: "'반' 컬럼으로 그룹핑해서 각 반의 평균 점수를 딕셔너리로 반환하는 함수를 완성하세요 (예: {'1반': 90.0}).",
          starterCode: `import pandas as pd

def group_average_score(data):
    df = pd.DataFrame(data)
    # TODO: '반' 컬럼으로 그룹핑해서 반별 평균 점수를 딕셔너리로 반환하세요
    pass
`,
          assertion: `result = group_average_score({'반': ['1반', '1반', '2반'], '점수': [90, 90, 85]})
assert result == {'1반': 90.0, '2반': 85.0}, f"결과: {result}"`,
          hint: "df.groupby('반')['점수'].mean()을 쓰고 .to_dict()로 딕셔너리로 바꿔보세요.",
          solutionCode: `import pandas as pd

def group_average_score(data):
    df = pd.DataFrame(data)
    return df.groupby('반')['점수'].mean().to_dict()
`,
          solutionExplain: 'groupby는 같은 값끼리 묶어주고, mean()으로 평균을, to_dict()로 딕셔너리 형태로 변환합니다.',
        },
        {
          id: 'fill_missing_with_average',
          prompt: "'나이' 컬럼의 결측치를 전체 평균값으로 채운 뒤, 나이 리스트를 반환하는 함수를 완성하세요.",
          starterCode: `import pandas as pd

def fill_missing_with_average(data):
    df = pd.DataFrame(data)
    # TODO: '나이'의 결측치를 평균값으로 채운 뒤 리스트로 반환하세요
    pass
`,
          assertion: `result = fill_missing_with_average({'나이': [10, 20, None]})
assert list(result) == [10.0, 20.0, 15.0], f"결과: {list(result)}"`,
          hint: 'df["나이"].fillna(df["나이"].mean())을 사용해보세요.',
          solutionCode: `import pandas as pd

def fill_missing_with_average(data):
    df = pd.DataFrame(data)
    filled = df['나이'].fillna(df['나이'].mean())
    return filled.tolist()
`,
          solutionExplain: 'fillna()는 결측치(NaN)를 지정한 값으로 채워줍니다. 평균으로 채우는 건 아주 흔한 전처리 방법이에요.',
        },
      ],
    },
  ],
}
