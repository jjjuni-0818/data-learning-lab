import type { ChapterContent } from '../types/chapter'

export const projectBasedLearning: ChapterContent = {
  chapterId: '05_project_based_learning',
  pyodidePackages: ['pandas', 'numpy', 'matplotlib'],
  description:
    '지금까지 배운 걸 하나로 모아, 가상의 건강검진 데이터로 미니 프로젝트를 해봐요. 문제 정의 → 데이터 불러오기/정제 → 탐색 → 분석 → 시각화 → 결론까지, 실제 분석 흐름 그대로 따라가 봅니다.',
  exampleCode: `import pandas as pd

data = {
    '나이': [25, 45, 65, 35],
    '흡연여부': [0, 1, 1, 0],
    '질병여부': [0, 0, 1, 0],
}
df = pd.DataFrame(data)

# 흡연 여부에 따른 질병 발생률(비율)을 한 번에 계산
print(df.groupby('흡연여부')['질병여부'].mean())
`,
  tiers: [
    {
      key: 'beginner',
      label: '초급',
      exercises: [
        {
          id: 'load_and_inspect',
          prompt: '건강검진 데이터를 불러온 뒤, (전체 행 개수, 전체 결측치 개수) 튜플로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def load_and_inspect(data):
    df = pd.DataFrame(data)
    # TODO: (행 개수, 전체 결측치 개수) 튜플을 반환하세요
    pass
`,
          assertion: `result = load_and_inspect({'나이': [25, None, 45], 'BMI': [22, 24, None]})
assert result == (3, 2), f"결과: {result}"`,
          hint: 'df.shape[0]로 행 개수를, df.isna().sum().sum()으로 전체 결측치 개수를 구할 수 있어요.',
          solutionCode: `import pandas as pd

def load_and_inspect(data):
    df = pd.DataFrame(data)
    return (df.shape[0], int(df.isna().sum().sum()))
`,
          solutionExplain: '데이터를 분석하기 전 가장 먼저 하는 일은 "크기가 얼마나 되고, 빠진 값은 얼마나 있는지" 확인하는 거예요. isna().sum()에 .sum()을 한 번 더 하면 전체 결측치 개수가 나와요.',
        },
        {
          id: 'clean_patient_data',
          prompt: '결측치가 있는 환자 기록을 모두 제거한 뒤, 남은 환자 수를 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def clean_patient_data(data):
    df = pd.DataFrame(data)
    # TODO: 결측치가 있는 행을 제거한 뒤, 남은 행의 개수를 반환하세요
    pass
`,
          assertion: `result = clean_patient_data({'나이': [25, None, 45, 50], 'BMI': [22, 24, None, 27]})
assert result == 2, f"결과: {result}"`,
          hint: 'dropna()로 결측치가 있는 행을 제거한 뒤 len()으로 세어보세요.',
          solutionCode: `import pandas as pd

def clean_patient_data(data):
    df = pd.DataFrame(data)
    return len(df.dropna())
`,
          solutionExplain: '실제 헬스케어 데이터 분석에서도, 결측치가 있는 환자 기록은 분석 전에 제외하거나 다른 값으로 대체하는 게 일반적인 첫 정제 단계예요.',
        },
        {
          id: 'bmi_category',
          prompt: 'BMI 수치를 [저체중, 정상, 과체중, 비만] 4단계로 분류해서 리스트로 반환하는 함수를 완성하세요. (경계값: 18.5, 23, 25)',
          starterCode: `import pandas as pd

def bmi_category(data):
    df = pd.DataFrame(data)
    bins = [0, 18.5, 23, 25, 100]
    labels = ['저체중', '정상', '과체중', '비만']
    # TODO: pd.cut을 사용해 BMI를 구간별 카테고리로 나누고, 리스트로 반환하세요
    pass
`,
          assertion: `result = bmi_category({'BMI': [17, 20, 24, 30]})
result_str = [str(x) for x in result]
assert result_str == ['저체중', '정상', '과체중', '비만'], f"결과: {result_str}"`,
          hint: 'pd.cut(컬럼, bins=경계값리스트, labels=이름리스트)로 연속된 숫자를 구간별 카테고리로 나눌 수 있어요.',
          solutionCode: `import pandas as pd

def bmi_category(data):
    df = pd.DataFrame(data)
    bins = [0, 18.5, 23, 25, 100]
    labels = ['저체중', '정상', '과체중', '비만']
    df['체중분류'] = pd.cut(df['BMI'], bins=bins, labels=labels)
    return df['체중분류'].tolist()
`,
          solutionExplain: 'pd.cut은 나이/체중/점수처럼 연속적인 숫자 데이터를 몇 개의 구간(카테고리)으로 나눌 때 실무에서 아주 많이 쓰이는 함수예요.',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'disease_rate_by_group',
          prompt: '지정한 그룹 컬럼(group_col)으로 나눠서, 타겟 컬럼(target_col, 0/1)의 그룹별 발생률을 딕셔너리로 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def disease_rate_by_group(data, group_col, target_col):
    df = pd.DataFrame(data)
    # TODO: group_col로 그룹핑해서 target_col의 평균(=발생률)을 딕셔너리로 반환하세요
    pass
`,
          assertion: `result = disease_rate_by_group({'흡연여부': [0, 0, 1, 1], '질병여부': [0, 1, 1, 1]}, '흡연여부', '질병여부')
assert abs(result[0] - 0.5) < 0.01, f"결과: {result}"
assert abs(result[1] - 1.0) < 0.01, f"결과: {result}"`,
          hint: 'groupby(group_col)[target_col].mean()을 쓰면, target_col이 0/1로만 되어있을 때 그 평균이 바로 "1의 비율"이 돼요.',
          solutionCode: `import pandas as pd

def disease_rate_by_group(data, group_col, target_col):
    df = pd.DataFrame(data)
    return df.groupby(group_col)[target_col].mean().to_dict()
`,
          solutionExplain: '0과 1로 이루어진 컬럼의 평균을 구하면 "1의 비율"이 나와요. 그룹별 발병률처럼 헬스케어 분석에서 정말 자주 쓰이는 계산 방법입니다.',
        },
        {
          id: 'age_group_avg_bp',
          prompt: "나이를 [청년, 중년, 노년] 연령대로 나눈 뒤, 연령대별 평균 혈압을 딕셔너리로 반환하는 함수를 완성하세요. (경계값: 40, 60)",
          starterCode: `import pandas as pd

def age_group_avg_bp(data):
    df = pd.DataFrame(data)
    bins = [0, 40, 60, 120]
    labels = ['청년', '중년', '노년']
    # TODO: 나이를 연령대로 나눈 뒤, 연령대별 '혈압' 평균을 딕셔너리로 반환하세요
    pass
`,
          assertion: `result = age_group_avg_bp({'나이': [25, 35, 50, 70], '혈압': [110, 120, 130, 140]})
assert abs(result['청년'] - 115) < 0.01, f"결과: {result}"
assert abs(result['중년'] - 130) < 0.01, f"결과: {result}"
assert abs(result['노년'] - 140) < 0.01, f"결과: {result}"`,
          hint: "먼저 pd.cut(df['나이'], bins=bins, labels=labels)로 연령대 컬럼을 만들고, 그 연령대로 groupby해서 '혈압' 평균을 구해보세요. (groupby(..., observed=True) 형태로 쓰면 더 안전해요)",
          solutionCode: `import pandas as pd

def age_group_avg_bp(data):
    df = pd.DataFrame(data)
    bins = [0, 40, 60, 120]
    labels = ['청년', '중년', '노년']
    df['연령대'] = pd.cut(df['나이'], bins=bins, labels=labels)
    return df.groupby('연령대', observed=True)['혈압'].mean().to_dict()
`,
          solutionExplain: '연속적인 나이를 구간으로 나눠서 그룹별 평균을 비교하는 건 헬스케어 데이터 분석에서 아주 자주 쓰이는 패턴이에요 (연령대별 위험도 비교 등).',
        },
        {
          id: 'top_correlated_factor',
          prompt: '여러 숫자형 컬럼 중, 타겟 컬럼(target_col)과 가장 강하게(절댓값 기준) 상관관계가 있는 컬럼의 이름을 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def top_correlated_factor(data, target_col):
    df = pd.DataFrame(data)
    # TODO: target_col과 다른 컬럼들의 상관계수를 구해서,
    # 절댓값이 가장 큰 컬럼의 이름을 반환하세요
    pass
`,
          assertion: `result = top_correlated_factor({'콜레스테롤': [180, 200, 220, 240], '흡연여부': [0, 0, 0, 1], '질병여부': [0, 0, 1, 1]}, '질병여부')
assert result == '콜레스테롤', f"결과: {result}"`,
          hint: "df.corr()[target_col]로 target과 다른 컬럼들 사이의 상관계수를 한 번에 볼 수 있어요. drop(target_col)로 자기 자신은 빼고, abs().idxmax()로 절댓값이 가장 큰 컬럼 이름을 찾아보세요.",
          solutionCode: `import pandas as pd

def top_correlated_factor(data, target_col):
    df = pd.DataFrame(data)
    corr = df.corr()[target_col].drop(target_col)
    return corr.abs().idxmax()
`,
          solutionExplain: 'idxmax()는 값이 가장 큰 항목의 이름(인덱스)을 반환해요. 상관계수의 절댓값이 클수록 그 변수가 타겟과 강하게 관련되어 있다는 뜻이라, "어떤 요인이 가장 중요한가"를 찾을 때 자주 쓰는 방법이에요.',
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'plot_disease_rate_by_group',
          prompt: '그룹별 발생률을 막대그래프로 그리는 함수를 완성하세요.',
          starterCode: `import pandas as pd
import matplotlib.pyplot as plt

def plot_disease_rate_by_group(data, group_col, target_col):
    df = pd.DataFrame(data)
    rates = df.groupby(group_col)[target_col].mean()
    fig, ax = plt.subplots()
    # TODO: rates를 막대그래프로 그리고 ax를 반환하세요
    return ax
`,
          assertion: `ax = plot_disease_rate_by_group({'흡연여부': [0, 0, 1, 1], '질병여부': [0, 1, 1, 1]}, '흡연여부', '질병여부')
heights = [p.get_height() for p in ax.patches]
assert abs(heights[0] - 0.5) < 0.01, f"결과: {heights}"
assert abs(heights[1] - 1.0) < 0.01, f"결과: {heights}"`,
          hint: 'ax.bar(rates.index.astype(str), rates.values)로 그룹별 값을 막대그래프로 그릴 수 있어요.',
          solutionCode: `import pandas as pd
import matplotlib.pyplot as plt

def plot_disease_rate_by_group(data, group_col, target_col):
    df = pd.DataFrame(data)
    rates = df.groupby(group_col)[target_col].mean()
    fig, ax = plt.subplots()
    ax.bar(rates.index.astype(str), rates.values)
    return ax
`,
          solutionExplain: 'groupby로 계산한 결과(Series)를 그대로 bar()에 넘기면, 그룹별 값을 한눈에 비교하는 그래프가 돼요. 발병률 비교처럼 결론을 전달할 때 자주 쓰는 방식입니다.',
        },
        {
          id: 'plot_risk_comparison',
          prompt: '질병 유무(target_col)에 따라 위험 요인(value_col)의 분포를 박스플롯 두 개로 나란히 비교하는 함수를 완성하세요.',
          starterCode: `import pandas as pd
import matplotlib.pyplot as plt

def plot_risk_comparison(data, target_col, value_col):
    df = pd.DataFrame(data)
    group0 = df[df[target_col] == 0][value_col].tolist()
    group1 = df[df[target_col] == 1][value_col].tolist()
    fig, ax = plt.subplots()
    # TODO: group0, group1을 나란히 박스플롯으로 그리고, 결과를 반환하세요
    pass
`,
          assertion: `result = plot_risk_comparison({'질병여부': [0, 0, 1, 1], '콜레스테롤': [180, 190, 240, 260]}, '질병여부', '콜레스테롤')
assert len(result['boxes']) == 2, f"박스 개수: {len(result['boxes'])}"
median0 = result['medians'][0].get_ydata()[0]
median1 = result['medians'][1].get_ydata()[0]
assert abs(median0 - 185) < 0.01, f"결과: {median0}"
assert abs(median1 - 250) < 0.01, f"결과: {median1}"`,
          hint: 'ax.boxplot([group0, group1])처럼 두 그룹을 리스트로 묶어서 넘기면 나란히 그려줘요.',
          solutionCode: `import pandas as pd
import matplotlib.pyplot as plt

def plot_risk_comparison(data, target_col, value_col):
    df = pd.DataFrame(data)
    group0 = df[df[target_col] == 0][value_col].tolist()
    group1 = df[df[target_col] == 1][value_col].tolist()
    fig, ax = plt.subplots()
    bxp = ax.boxplot([group0, group1])
    return bxp
`,
          solutionExplain: '질병이 있는 그룹과 없는 그룹의 콜레스테롤 분포를 나란히 비교하면, "이 요인이 질병과 관련이 있어 보인다"는 시각적 근거가 돼요. 실제 의료 데이터 분석 보고서에서 자주 보는 그래프입니다.',
        },
        {
          id: 'summarize_findings',
          prompt: '지금까지의 분석을 종합해서, {전체 환자 수, 전체 발생률, 가장 관련 높은 요인}을 담은 결론 딕셔너리를 반환하는 함수를 완성하세요.',
          starterCode: `import pandas as pd

def summarize_findings(data, target_col):
    df = pd.DataFrame(data)
    # TODO: {'total': 전체환자수, 'disease_rate': 전체발생률, 'most_correlated': 가장상관높은컬럼} 을 반환하세요
    pass
`,
          assertion: `result = summarize_findings({'콜레스테롤': [180, 200, 220, 240], '흡연여부': [0, 0, 0, 1], '질병여부': [0, 0, 1, 1]}, '질병여부')
assert result['total'] == 4, f"결과: {result}"
assert abs(result['disease_rate'] - 0.5) < 0.01, f"결과: {result}"
assert result['most_correlated'] == '콜레스테롤', f"결과: {result}"`,
          hint: '앞에서 배운 것들을 조합해보세요: len(df), df[target_col].mean(), 그리고 top_correlated_factor 문제에서 썼던 상관계수 계산 방식을요.',
          solutionCode: `import pandas as pd

def summarize_findings(data, target_col):
    df = pd.DataFrame(data)
    total = len(df)
    disease_rate = df[target_col].mean()
    corr = df.corr()[target_col].drop(target_col)
    most_correlated = corr.abs().idxmax()
    return {'total': total, 'disease_rate': disease_rate, 'most_correlated': most_correlated}
`,
          solutionExplain: '이 문제가 이 챕터의 결론 단계예요 — 지금까지 따로따로 계산했던 것들(개수 세기, 비율 계산, 상관관계 찾기)을 한 함수 안에 모아서, "데이터를 보고 무엇을 알아냈는가"를 정리하는 연습이었어요.',
        },
      ],
    },
  ],
}
