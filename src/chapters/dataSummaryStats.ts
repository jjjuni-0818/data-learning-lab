import type { ChapterContent } from '../types/chapter'

export const dataSummaryStats: ChapterContent = {
  chapterId: '04_data_summary_stats',
  pyodidePackages: ['numpy', 'matplotlib'],
  description:
    '평균 하나만 보면 데이터를 오해하기 쉬워요. 평균/중앙값/표준편차/분위수를 함께 보고, 히스토그램으로 분포 모양까지 확인하면서 "이 숫자가 데이터에 대해 무엇을 말해주는지" 감각을 잡아봅니다.',
  exampleCode: `import numpy as np

scores = np.array([60, 65, 70, 72, 68, 75, 30])

print('평균:', np.mean(scores))
print('중앙값:', np.median(scores))
print('표준편차:', np.std(scores))
`,
  tiers: [
    {
      key: 'beginner',
      label: '초급',
      exercises: [
        {
          id: 'calc_mean_median',
          prompt: '값들의 평균과 중앙값을 {\'mean\': .., \'median\': ..} 딕셔너리로 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def calc_mean_median(values):
    arr = np.array(values)
    # TODO: 평균과 중앙값을 딕셔너리로 반환하세요
    pass
`,
          assertion: `result = calc_mean_median([1, 2, 3, 4, 100])
assert abs(result['mean'] - 22.0) < 0.01, f"결과: {result}"
assert abs(result['median'] - 3.0) < 0.01, f"결과: {result}"`,
          hint: 'np.mean(arr)과 np.median(arr)을 각각 계산해보세요.',
          solutionCode: `import numpy as np

def calc_mean_median(values):
    arr = np.array(values)
    return {'mean': float(np.mean(arr)), 'median': float(np.median(arr))}
`,
          solutionExplain: '[1,2,3,4,100]처럼 극단적으로 큰 값(100)이 하나만 있어도 평균(22.0)은 확 커져버려요. 반면 중앙값(3.0)은 이런 극단값의 영향을 거의 안 받아요. 그래서 데이터에 이상치가 있을 땐 평균만 보지 말고 중앙값도 같이 봐야 합니다.',
        },
        {
          id: 'calc_variance_std',
          prompt: '값들의 분산(variance)과 표준편차(std)를 {\'variance\': .., \'std\': ..} 딕셔너리로 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def calc_variance_std(values):
    arr = np.array(values)
    # TODO: 분산과 표준편차를 딕셔너리로 반환하세요
    pass
`,
          assertion: `result = calc_variance_std([2, 4, 4, 4, 5, 5, 7, 9])
assert abs(result['variance'] - 4.0) < 0.01, f"결과: {result}"
assert abs(result['std'] - 2.0) < 0.01, f"결과: {result}"`,
          hint: 'np.var(arr)로 분산을, np.std(arr)로 표준편차를 구할 수 있어요. (표준편차는 분산의 제곱근이에요)',
          solutionCode: `import numpy as np

def calc_variance_std(values):
    arr = np.array(values)
    return {'variance': float(np.var(arr)), 'std': float(np.std(arr))}
`,
          solutionExplain: '분산과 표준편차는 "데이터가 평균에서 얼마나 퍼져있는지"를 나타내요. 값이 클수록 데이터가 넓게 흩어져있다는 뜻이에요.',
        },
        {
          id: 'calc_percentile',
          prompt: '값들의 q번째 백분위수(percentile)를 계산해서 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def calc_percentile(values, q):
    arr = np.array(values)
    # TODO: q번째 백분위수를 반환하세요
    pass
`,
          assertion: `assert abs(calc_percentile([1, 2, 3, 4], 50) - 2.5) < 0.01`,
          hint: 'np.percentile(arr, q)로 백분위수를 계산할 수 있어요. 50번째 백분위수는 중앙값과 같은 뜻이에요.',
          solutionCode: `import numpy as np

def calc_percentile(values, q):
    arr = np.array(values)
    return float(np.percentile(arr, q))
`,
          solutionExplain: '백분위수는 "전체 데이터 중 몇 %가 이 값보다 작은가"를 나타내요. 25번째, 75번째 백분위수는 각각 1사분위수(Q1), 3사분위수(Q3)라고도 부릅니다.',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'z_score',
          prompt: '전체 데이터(values) 기준으로, 특정 값 x의 z-점수(표준화 점수)를 계산해서 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def z_score(values, x):
    arr = np.array(values)
    mean = np.mean(arr)
    std = np.std(arr)
    # TODO: (x - mean) / std를 계산해서 반환하세요
    pass
`,
          assertion: `assert abs(z_score([2, 4, 4, 4, 5, 5, 7, 9], 9) - 2.0) < 0.01`,
          hint: '(x - mean) / std 공식을 그대로 코드로 옮겨보세요.',
          solutionCode: `import numpy as np

def z_score(values, x):
    arr = np.array(values)
    mean = np.mean(arr)
    std = np.std(arr)
    return float((x - mean) / std)
`,
          solutionExplain: 'z-점수는 "이 값이 평균에서 표준편차 몇 개만큼 떨어져 있는가"를 나타내요. z=2.0이면 평균보다 표준편차 2배만큼 큰 값이라는 뜻이라, 꽤 드문(이상치에 가까운) 값이라고 볼 수 있어요.',
        },
        {
          id: 'plot_histogram_with_mean',
          prompt: '값들의 히스토그램을 그리고, 평균 위치에 세로선을 추가하는 함수를 완성하세요.',
          starterCode: `import numpy as np
import matplotlib.pyplot as plt

def plot_histogram_with_mean(values, bins):
    arr = np.array(values)
    fig, ax = plt.subplots()
    # TODO: arr로 히스토그램을 그리고, arr.mean() 위치에 세로선을 추가하세요
    return ax
`,
          assertion: `ax = plot_histogram_with_mean([1, 2, 3, 4, 5], 5)
assert len(ax.patches) == 5, f"막대 개수: {len(ax.patches)}"
assert len(ax.lines) == 1, "평균선이 없어요"
mean_line_x = ax.lines[0].get_xdata()[0]
assert abs(mean_line_x - 3.0) < 0.01, f"결과: {mean_line_x}"`,
          hint: 'ax.hist(arr, bins=bins)로 히스토그램을 그린 뒤, ax.axvline(arr.mean())으로 평균 위치에 세로선을 그어보세요.',
          solutionCode: `import numpy as np
import matplotlib.pyplot as plt

def plot_histogram_with_mean(values, bins):
    arr = np.array(values)
    fig, ax = plt.subplots()
    ax.hist(arr, bins=bins)
    ax.axvline(arr.mean(), color='red')
    return ax
`,
          solutionExplain: '숫자로만 평균을 보는 것보다, 히스토그램 위에 평균선을 그어보면 "이 평균이 전체 분포에서 어디쯤 있는지"를 훨씬 직관적으로 알 수 있어요.',
        },
        {
          id: 'compare_spread',
          prompt: '두 데이터 그룹 중 어느 쪽이 더 넓게 퍼져있는지(표준편차 기준) 비교해서 (\'A\', \'B\', \'equal\') 중 하나를 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def compare_spread(data_a, data_b):
    std_a = np.std(data_a)
    std_b = np.std(data_b)
    # TODO: std_a와 std_b를 비교해서 'A', 'B', 'equal' 중 하나를 반환하세요
    pass
`,
          assertion: `assert compare_spread([1, 2, 3, 4, 5], [3, 3, 3, 3, 3]) == 'A'`,
          hint: 'if std_a > std_b: return \'A\' 처럼 두 표준편차를 비교해보세요.',
          solutionCode: `import numpy as np

def compare_spread(data_a, data_b):
    std_a = np.std(data_a)
    std_b = np.std(data_b)
    if std_a > std_b:
        return 'A'
    elif std_b > std_a:
        return 'B'
    else:
        return 'equal'
`,
          solutionExplain: '두 그룹의 평균이 같아도, 표준편차가 다르면 완전히 다른 데이터예요. [3,3,3,3,3]은 표준편차가 0(전혀 안 퍼져있음)이라, 어떤 데이터와 비교해도 항상 덜 퍼진 쪽이 됩니다.',
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'detect_outliers_zscore',
          prompt: 'z-점수의 절댓값이 threshold를 넘는 값들을(이상치로 판단) 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def detect_outliers_zscore(values, threshold):
    arr = np.array(values)
    mean = arr.mean()
    std = arr.std()
    z_scores = (arr - mean) / std
    # TODO: z_scores의 절댓값이 threshold보다 큰 값들만 리스트로 반환하세요
    pass
`,
          assertion: `result = detect_outliers_zscore([10, 12, 11, 13, 100], 1.5)
assert result == [100], f"결과: {result}"`,
          hint: 'np.abs(z_scores) > threshold로 조건을 만들고, arr[조건]으로 그 값들만 골라낸 뒤 .tolist()로 바꿔보세요.',
          solutionCode: `import numpy as np

def detect_outliers_zscore(values, threshold):
    arr = np.array(values)
    mean = arr.mean()
    std = arr.std()
    z_scores = (arr - mean) / std
    return arr[np.abs(z_scores) > threshold].tolist()
`,
          solutionExplain: 'z-점수 방식은 이상치를 자동으로 찾아내는 표준적인 방법 중 하나예요. threshold(보통 2~3)를 넘는 값은 "평균에서 너무 멀리 떨어진, 흔치 않은 값"으로 간주합니다.',
        },
        {
          id: 'plot_distribution_comparison',
          prompt: '두 그룹의 분포를 히스토그램 두 개로 겹쳐서 비교하는 함수를 완성하세요.',
          starterCode: `import numpy as np
import matplotlib.pyplot as plt

def plot_distribution_comparison(data_a, data_b, bins):
    fig, ax = plt.subplots()
    # TODO: data_a와 data_b를 각각 반투명(alpha)한 히스토그램으로 겹쳐 그리세요
    return ax
`,
          assertion: `ax = plot_distribution_comparison([1, 2, 3, 4], [1, 1, 2, 2], 4)
assert len(ax.patches) == 8, f"막대 총 개수: {len(ax.patches)}"`,
          hint: "ax.hist(data_a, bins=bins, alpha=0.5)와 ax.hist(data_b, bins=bins, alpha=0.5)를 순서대로 호출해보세요. alpha는 투명도예요.",
          solutionCode: `import numpy as np
import matplotlib.pyplot as plt

def plot_distribution_comparison(data_a, data_b, bins):
    fig, ax = plt.subplots()
    ax.hist(data_a, bins=bins, alpha=0.5, label='A')
    ax.hist(data_b, bins=bins, alpha=0.5, label='B')
    return ax
`,
          solutionExplain: '반투명하게 겹쳐 그리면, 두 그룹의 분포가 어디서 겹치고 어디서 다른지 한 화면에서 비교할 수 있어요. A/B 테스트 결과 비교 같은 데서 자주 쓰는 방식이에요.',
        },
        {
          id: 'summarize_distribution',
          prompt: '값들의 평균/중앙값/표준편차/최솟값/최댓값을 모두 담은 종합 요약 딕셔너리를 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def summarize_distribution(values):
    arr = np.array(values)
    # TODO: {'mean':.., 'median':.., 'std':.., 'min':.., 'max':..} 를 반환하세요
    pass
`,
          assertion: `result = summarize_distribution([1, 2, 3, 4, 5])
assert abs(result['mean'] - 3.0) < 0.01
assert abs(result['median'] - 3.0) < 0.01
assert abs(result['std'] - 1.4142) < 0.01
assert result['min'] == 1.0
assert result['max'] == 5.0`,
          hint: '이 챕터에서 배운 np.mean, np.median, np.std와 np.min, np.max를 조합해서 하나의 딕셔너리로 모아보세요.',
          solutionCode: `import numpy as np

def summarize_distribution(values):
    arr = np.array(values)
    return {
        'mean': float(np.mean(arr)),
        'median': float(np.median(arr)),
        'std': float(np.std(arr)),
        'min': float(np.min(arr)),
        'max': float(np.max(arr)),
    }
`,
          solutionExplain: '이 챕터의 결론이에요 — 데이터를 처음 볼 때, 이 5가지 숫자(평균/중앙값/표준편차/최소/최대)만 훑어봐도 "대략 어떤 모양의 데이터인지" 감을 잡을 수 있어요. pandas의 describe()가 하는 일도 결국 이런 요약이에요.',
        },
      ],
    },
  ],
}
