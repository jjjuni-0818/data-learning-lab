import type { ChapterContent } from '../types/chapter'

export const dataExploration: ChapterContent = {
  chapterId: '03_data_exploration',
  description:
    '데이터를 점검했다면 이제 패턴을 찾아볼 차례예요. 범주형 변수는 값의 종류와 분포를, 숫자형 변수는 그룹별 통계와 다른 변수와의 관계를 살펴봅니다.',
  exampleCode: `import pandas as pd

data = {'반': ['1반', '1반', '2반', '2반'], '나이': [17, 16, 17, 16], '점수': [88, 92, 79, 95]}
df = pd.DataFrame(data)
print(df['반'].value_counts())
print(df.groupby('반')['점수'].mean())
`,
  tiers: [
    {
      key: 'beginner',
      label: '초급',
      exercises: [
        {
          id: 'unique_values',
          prompt: '지정한 컬럼에 어떤 값들이 있는지, 중복 없이 정렬된 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def unique_values(data, column_name):
    df = pd.DataFrame(data)
    # TODO: column_name 컬럼의 고유값을 정렬된 리스트로 반환하세요
    pass
`,
          assertion: `result = unique_values({'반': ['1반', '2반', '1반', '3반']}, '반')
assert result == ['1반', '2반', '3반'], f"결과: {result}"`,
          hint: 'unique()는 중복 없는 값들을 배열로 반환해요. list()로 바꾸고 sorted()로 정렬해보세요.',
          solutionCode: `import pandas as pd

def unique_values(data, column_name):
    df = pd.DataFrame(data)
    return sorted(df[column_name].unique().tolist())
`,
          solutionExplain: 'unique()는 등장 순서대로 고유값을 반환하는데, 비교하기 쉽게 정렬해서 리스트로 만들었습니다.',
        },
        {
          id: 'value_counts_dict',
          prompt: '지정한 컬럼의 각 값이 몇 번씩 등장하는지 {값: 개수} 딕셔너리로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def value_counts_dict(data, column_name):
    df = pd.DataFrame(data)
    # TODO: 각 값의 등장 횟수를 딕셔너리로 반환하세요
    pass
`,
          assertion: `result = value_counts_dict({'반': ['1반', '2반', '1반', '1반']}, '반')
assert result == {'1반': 3, '2반': 1}, f"결과: {result}"`,
          hint: 'value_counts()는 각 값이 몇 번 등장했는지 세어줘요. to_dict()로 딕셔너리로 바꿀 수 있어요.',
          solutionCode: `import pandas as pd

def value_counts_dict(data, column_name):
    df = pd.DataFrame(data)
    return df[column_name].value_counts().to_dict()
`,
          solutionExplain: 'value_counts()는 범주형 데이터를 탐색할 때 가장 먼저 쓰는 메서드 중 하나입니다.',
        },
        {
          id: 'filter_multi_condition',
          prompt: '나이가 min_age 이상이면서 동시에 점수가 min_score 이상인 사람의 이름만 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def filter_multi_condition(data, min_age, min_score):
    df = pd.DataFrame(data)
    # TODO: 나이 조건과 점수 조건을 동시에 만족하는 사람의 이름을 반환하세요
    pass
`,
          assertion: `result = filter_multi_condition({'이름': ['민준', '서연', '하은'], '나이': [17, 16, 17], '점수': [88, 92, 70]}, 17, 80)
assert list(result) == ['민준'], f"결과: {list(result)}"`,
          hint: '조건 두 개를 & 로 연결하고, 각 조건은 반드시 괄호로 감싸야 해요. 예: df[(조건1) & (조건2)]',
          solutionCode: `import pandas as pd

def filter_multi_condition(data, min_age, min_score):
    df = pd.DataFrame(data)
    return df[(df['나이'] >= min_age) & (df['점수'] >= min_score)]['이름'].tolist()
`,
          solutionExplain: '여러 조건을 동시에 적용할 때는 and 대신 & 를 쓰고, 각 조건을 괄호로 감싸야 합니다 (연산자 우선순위 때문).',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'group_multi_agg',
          prompt: "'반' 컬럼으로 그룹핑해서, 반별 점수의 개수(count)와 평균(mean)을 {'1반': {'count':2, 'mean':90.0}} 형태로 반환하는 함수를 완성하세요.",
          starterCode: `import pandas as pd

def group_multi_agg(data):
    df = pd.DataFrame(data)
    # TODO: '반'별로 '점수'의 개수와 평균을 함께 구해 중첩 딕셔너리로 반환하세요
    pass
`,
          assertion: `result = group_multi_agg({'반': ['1반', '1반', '2반'], '점수': [90, 90, 85]})
assert result['1반']['count'] == 2, f"결과: {result}"
assert abs(result['1반']['mean'] - 90) < 0.01, f"결과: {result}"
assert result['2반']['count'] == 1, f"결과: {result}"`,
          hint: "groupby('반')['점수'].agg(['count', 'mean'])으로 여러 통계를 한 번에 구할 수 있어요. to_dict('index')로 중첩 딕셔너리로 바꿔보세요.",
          solutionCode: `import pandas as pd

def group_multi_agg(data):
    df = pd.DataFrame(data)
    result = df.groupby('반')['점수'].agg(['count', 'mean'])
    return result.to_dict('index')
`,
          solutionExplain: "agg()에 여러 함수를 리스트로 넘기면 한 번에 여러 통계를 계산합니다. to_dict('index')는 그룹명을 키로 하는 중첩 딕셔너리로 변환해줘요.",
        },
        {
          id: 'group_min_max',
          prompt: "'반' 컬럼으로 그룹핑해서, 반별 점수의 최솟값(min)과 최댓값(max)을 중첩 딕셔너리로 반환하는 함수를 완성하세요.",
          starterCode: `import pandas as pd

def group_min_max(data):
    df = pd.DataFrame(data)
    # TODO: '반'별로 '점수'의 최솟값과 최댓값을 함께 구해 중첩 딕셔너리로 반환하세요
    pass
`,
          assertion: `result = group_min_max({'반': ['1반', '1반', '2반'], '점수': [80, 95, 85]})
assert result['1반']['min'] == 80, f"결과: {result}"
assert result['1반']['max'] == 95, f"결과: {result}"
assert result['2반']['min'] == 85, f"결과: {result}"`,
          hint: "groupby('반')['점수'].agg(['min', 'max'])을 써보세요. 앞 문제(group_multi_agg)와 거의 같은 패턴이에요.",
          solutionCode: `import pandas as pd

def group_min_max(data):
    df = pd.DataFrame(data)
    result = df.groupby('반')['점수'].agg(['min', 'max'])
    return result.to_dict('index')
`,
          solutionExplain: 'agg()에 넘기는 함수 목록만 바꾸면 같은 패턴으로 다양한 통계를 그룹별로 구할 수 있습니다.',
        },
        {
          id: 'top_n_by_score',
          prompt: '점수가 높은 순서로 상위 n명의 이름을 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def top_n_by_score(data, n):
    df = pd.DataFrame(data)
    # TODO: 점수 기준 상위 n명의 이름을 리스트로 반환하세요
    pass
`,
          assertion: `result = top_n_by_score({'이름': ['민준', '서연', '하은'], '점수': [88, 92, 79]}, 2)
assert list(result) == ['서연', '민준'], f"결과: {list(result)}"`,
          hint: '챕터1에서 배운 sort_values로 내림차순 정렬한 뒤, head(n)으로 상위 n개만 잘라보세요.',
          solutionCode: `import pandas as pd

def top_n_by_score(data, n):
    df = pd.DataFrame(data)
    sorted_df = df.sort_values('점수', ascending=False)
    return sorted_df['이름'].head(n).tolist()
`,
          solutionExplain: 'sort_values + head(n) 조합은 "상위 N개"를 구할 때 실무에서 가장 널리 쓰이는 방법입니다.',
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'correlation_between',
          prompt: '두 숫자형 컬럼 사이의 상관계수를 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def correlation_between(data, col1, col2):
    df = pd.DataFrame(data)
    # TODO: col1과 col2 사이의 상관계수를 반환하세요
    pass
`,
          assertion: `result = correlation_between({'공부시간': [1, 2, 3, 4], '점수': [50, 60, 70, 80]}, '공부시간', '점수')
assert abs(result - 1.0) < 0.01, f"결과: {result}"`,
          hint: "df[col1].corr(df[col2])로 두 컬럼 사이의 상관계수(-1~1)를 계산할 수 있어요.",
          solutionCode: `import pandas as pd

def correlation_between(data, col1, col2):
    df = pd.DataFrame(data)
    return df[col1].corr(df[col2])
`,
          solutionExplain: 'corr()는 기본적으로 피어슨 상관계수를 계산합니다. 1이면 완벽한 양의 상관관계, -1이면 완벽한 음의 상관관계, 0이면 관계가 없다는 뜻이에요.',
        },
        {
          id: 'crosstab_count',
          prompt: '두 범주형 컬럼(col1, col2)의 조합별 개수를 중첩 딕셔너리로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def crosstab_count(data, col1, col2):
    df = pd.DataFrame(data)
    # TODO: col1과 col2의 교차표(조합별 개수)를 중첩 딕셔너리로 반환하세요
    pass
`,
          assertion: `result = crosstab_count({'반': ['1반', '1반', '2반'], '성별': ['남', '여', '남']}, '반', '성별')
assert result['1반']['남'] == 1, f"결과: {result}"
assert result['1반']['여'] == 1, f"결과: {result}"
assert result['2반']['남'] == 1, f"결과: {result}"`,
          hint: "pd.crosstab(df[col1], df[col2])는 두 범주형 컬럼의 조합별 개수를 표로 만들어줘요. to_dict('index')로 중첩 딕셔너리로 바꿀 수 있어요.",
          solutionCode: `import pandas as pd

def crosstab_count(data, col1, col2):
    df = pd.DataFrame(data)
    result = pd.crosstab(df[col1], df[col2])
    return result.to_dict('index')
`,
          solutionExplain: 'crosstab은 "반과 성별에 따라 인원이 몇 명씩인지"처럼 두 범주형 변수의 관계를 파악할 때 표준적으로 쓰이는 도구입니다.',
        },
        {
          id: 'outlier_bounds',
          prompt: 'IQR(사분위 범위) 방식으로 이상치 판단 경계값을 (하한, 상한) 튜플로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def outlier_bounds(data, column_name):
    df = pd.DataFrame(data)
    # TODO: Q1, Q3, IQR을 구해서 (하한, 상한) 튜플을 반환하세요
    # 하한 = Q1 - 1.5*IQR, 상한 = Q3 + 1.5*IQR
    pass
`,
          assertion: `result = outlier_bounds({'점수': [10, 20, 30, 40]}, '점수')
assert abs(result[0] - (-5.0)) < 0.01, f"결과: {result}"
assert abs(result[1] - 55.0) < 0.01, f"결과: {result}"`,
          hint: 'quantile(0.25)와 quantile(0.75)로 1사분위수, 3사분위수를 구하고, IQR = Q3 - Q1을 계산해보세요.',
          solutionCode: `import pandas as pd

def outlier_bounds(data, column_name):
    df = pd.DataFrame(data)
    col = df[column_name]
    q1 = col.quantile(0.25)
    q3 = col.quantile(0.75)
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    return (lower, upper)
`,
          solutionExplain: 'IQR(사분위 범위) 방식은 데이터 분석에서 이상치를 판단하는 가장 표준적인 방법입니다. 이 범위를 벗어나는 값을 이상치로 간주해요.',
        },
      ],
    },
  ],
}
