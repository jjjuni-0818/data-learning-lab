import type { ChapterContent } from '../types/chapter'

export const dataLoadingCleaning: ChapterContent = {
  chapterId: '02_data_loading_cleaning',
  description:
    '데이터를 불러온 뒤 가장 먼저 할 일은 "이 데이터가 어떻게 생겼는지" 점검하는 거예요. 행/열 개수, 자료형, 결측치 여부를 확인하고, 필요하면 정리(정제)까지 해봅니다.',
  exampleCode: `import pandas as pd

data = {'이름': ['민준', '서연', '하은', '지호'], '나이': [17, 16, 17, None], '점수': [88, 92, None, 75]}
df = pd.DataFrame(data)
print(df.info())
print(df.isna().sum())
`,
  tiers: [
    {
      key: 'beginner',
      label: '초급',
      exercises: [
        {
          id: 'get_shape',
          prompt: 'DataFrame의 크기를 (행 개수, 열 개수) 튜플로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def get_shape(data):
    df = pd.DataFrame(data)
    # TODO: (행 개수, 열 개수) 튜플을 반환하세요
    pass
`,
          assertion: `assert get_shape({'이름': ['민준', '서연', '하은'], '나이': [17, 16, 17]}) == (3, 2)`,
          hint: 'df.shape는 (행 개수, 열 개수) 형태의 튜플을 반환해요.',
          solutionCode: `import pandas as pd

def get_shape(data):
    df = pd.DataFrame(data)
    return df.shape
`,
          solutionExplain: 'shape 속성은 DataFrame의 크기를 (행, 열) 튜플로 알려줍니다.',
        },
        {
          id: 'count_missing',
          prompt: '지정한 컬럼(column_name)의 결측치 개수를 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def count_missing(data, column_name):
    df = pd.DataFrame(data)
    # TODO: column_name 컬럼의 결측치 개수를 반환하세요
    pass
`,
          assertion: `assert count_missing({'나이': [17, None, 16, None]}, '나이') == 2`,
          hint: 'isna()는 결측치 여부를 True/False로 알려주고, sum()으로 개수를 셀 수 있어요.',
          solutionCode: `import pandas as pd

def count_missing(data, column_name):
    df = pd.DataFrame(data)
    return int(df[column_name].isna().sum())
`,
          solutionExplain: 'isna()가 만든 True/False 값을 sum()하면 True(=1)의 개수, 즉 결측치 개수를 구할 수 있습니다.',
        },
        {
          id: 'get_dtypes',
          prompt: '각 컬럼의 자료형을 {컬럼이름: 자료형} 딕셔너리로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def get_dtypes(data):
    df = pd.DataFrame(data)
    # TODO: 각 컬럼의 자료형을 딕셔너리로 반환하세요
    pass
`,
          assertion: `result = get_dtypes({'이름': ['민준', '서연'], '나이': [17, 16]})
assert 'int' in str(result['나이']), f"결과: {result}"
assert str(result['이름']) in ('object', 'str'), f"결과: {result}"`,
          hint: 'df.dtypes는 각 컬럼의 자료형을 알려주는데, .astype(str)로 문자열로 바꾸고 .to_dict()로 딕셔너리로 바꿀 수 있어요.',
          solutionCode: `import pandas as pd

def get_dtypes(data):
    df = pd.DataFrame(data)
    return df.dtypes.astype(str).to_dict()
`,
          solutionExplain: 'dtypes는 Series 형태라서 astype(str)로 문자열화한 뒤 to_dict()로 변환하면 다루기 쉬운 딕셔너리가 됩니다.',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'basic_stats',
          prompt: "지정한 컬럼의 평균/중앙값/표준편차를 {'mean':..., 'median':..., 'std':...} 딕셔너리로 반환하는 함수를 완성하세요.",
          starterCode: `import pandas as pd

def basic_stats(data, column_name):
    df = pd.DataFrame(data)
    # TODO: {'mean':평균, 'median':중앙값, 'std':표준편차} 딕셔너리를 반환하세요
    pass
`,
          assertion: `result = basic_stats({'점수': [80, 90, 100]}, '점수')
assert abs(result['mean'] - 90) < 0.01, f"결과: {result}"
assert abs(result['median'] - 90) < 0.01, f"결과: {result}"
assert abs(result['std'] - 10) < 0.01, f"결과: {result}"`,
          hint: 'mean(), median(), std() 세 가지 메서드를 각각 호출해서 딕셔너리로 묶어보세요.',
          solutionCode: `import pandas as pd

def basic_stats(data, column_name):
    df = pd.DataFrame(data)
    col = df[column_name]
    return {'mean': col.mean(), 'median': col.median(), 'std': col.std()}
`,
          solutionExplain: '세 메서드 모두 결측치를 자동으로 제외하고 계산합니다.',
        },
        {
          id: 'select_numeric_columns',
          prompt: '숫자형 컬럼의 이름만 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def select_numeric_columns(data):
    df = pd.DataFrame(data)
    # TODO: 숫자형 컬럼 이름만 리스트로 반환하세요
    pass
`,
          assertion: `result = select_numeric_columns({'이름': ['민준', '서연'], '나이': [17, 16], '점수': [88, 92]})
assert set(result) == {'나이', '점수'}, f"결과: {result}"`,
          hint: "select_dtypes(include='number')로 숫자형 컬럼만 골라낼 수 있어요.",
          solutionCode: `import pandas as pd

def select_numeric_columns(data):
    df = pd.DataFrame(data)
    return df.select_dtypes(include='number').columns.tolist()
`,
          solutionExplain: "select_dtypes는 자료형을 기준으로 컬럼을 필터링합니다. include='number'는 정수/실수형 컬럼만 남겨요.",
        },
        {
          id: 'drop_missing_rows',
          prompt: '결측치가 있는 행을 모두 제거한 뒤, 남은 행의 개수를 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def drop_missing_rows(data):
    df = pd.DataFrame(data)
    # TODO: 결측치가 있는 행을 제거한 뒤, 남은 행의 개수를 반환하세요
    pass
`,
          assertion: `result = drop_missing_rows({'이름': ['민준', '서연', '하은'], '나이': [17, None, 17]})
assert result == 2, f"결과: {result}"`,
          hint: 'dropna()는 결측치가 하나라도 있는 행을 통째로 제거해줘요. len()으로 개수를 셀 수 있어요.',
          solutionCode: `import pandas as pd

def drop_missing_rows(data):
    df = pd.DataFrame(data)
    return len(df.dropna())
`,
          solutionExplain: 'dropna()의 기본 동작은 결측치가 있는 "행"을 지우는 것입니다 (열을 지우려면 axis=1).',
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'fill_missing_median',
          prompt: '지정한 컬럼의 결측치를 그 컬럼의 중앙값으로 채운 뒤, 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def fill_missing_median(data, column_name):
    df = pd.DataFrame(data)
    # TODO: column_name 컬럼의 결측치를 중앙값으로 채운 뒤 리스트로 반환하세요
    pass
`,
          assertion: `result = fill_missing_median({'나이': [10, 20, None, 20]}, '나이')
assert list(result) == [10.0, 20.0, 20.0, 20.0], f"결과: {list(result)}"`,
          hint: 'fillna()에 그 컬럼의 median() 값을 넣어보세요.',
          solutionCode: `import pandas as pd

def fill_missing_median(data, column_name):
    df = pd.DataFrame(data)
    filled = df[column_name].fillna(df[column_name].median())
    return filled.tolist()
`,
          solutionExplain: '평균은 이상치(너무 크거나 작은 값)에 민감하지만, 중앙값은 이상치의 영향을 덜 받아서 대체값으로 자주 쓰입니다.',
        },
        {
          id: 'drop_column',
          prompt: '지정한 컬럼을 제거한 뒤, 남은 컬럼 이름 목록을 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def drop_column(data, column_name):
    df = pd.DataFrame(data)
    # TODO: column_name 컬럼을 제거한 뒤 남은 컬럼 이름 목록을 반환하세요
    pass
`,
          assertion: `result = drop_column({'이름': ['민준'], '나이': [17], '메모': ['x']}, '메모')
assert list(result) == ['이름', '나이'], f"결과: {list(result)}"`,
          hint: 'drop(columns=[...])으로 특정 컬럼을 제거할 수 있어요.',
          solutionCode: `import pandas as pd

def drop_column(data, column_name):
    df = pd.DataFrame(data)
    return df.drop(columns=[column_name]).columns.tolist()
`,
          solutionExplain: 'drop()에 columns 인자를 주면 그 컬럼(들)을 제외한 나머지를 돌려줍니다. 원본 df는 그대로 유지돼요(inplace=False가 기본값).',
        },
        {
          id: 'describe_summary',
          prompt: "지정한 컬럼의 최솟값/최댓값/평균을 {'min':..., 'max':..., 'mean':...} 딕셔너리로 반환하는 함수를 완성하세요.",
          starterCode: `import pandas as pd

def describe_summary(data, column_name):
    df = pd.DataFrame(data)
    # TODO: {'min':최솟값, 'max':최댓값, 'mean':평균} 딕셔너리를 반환하세요
    pass
`,
          assertion: `result = describe_summary({'점수': [70, 80, 90]}, '점수')
assert result['min'] == 70, f"결과: {result}"
assert result['max'] == 90, f"결과: {result}"
assert abs(result['mean'] - 80) < 0.01, f"결과: {result}"`,
          hint: 'min(), max(), mean()을 각각 구해서 딕셔너리로 묶어보세요. describe()를 참고해도 좋아요.',
          solutionCode: `import pandas as pd

def describe_summary(data, column_name):
    df = pd.DataFrame(data)
    col = df[column_name]
    return {'min': col.min(), 'max': col.max(), 'mean': col.mean()}
`,
          solutionExplain: 'describe()를 쓰면 개수/평균/표준편차/최소/사분위수/최대를 한 번에 볼 수 있는데, 여기서는 그 중 핵심 3가지만 직접 뽑아봤어요.',
        },
      ],
    },
  ],
}
