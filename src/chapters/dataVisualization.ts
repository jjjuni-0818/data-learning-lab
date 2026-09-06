import type { ChapterContent } from '../types/chapter'

export const dataVisualization: ChapterContent = {
  chapterId: '04_data_visualization',
  pyodidePackages: ['pandas', 'numpy', 'matplotlib'],
  description:
    '숫자와 표만으로는 잘 안 보이던 패턴이, 그래프로 그려보면 한눈에 보일 때가 많아요. matplotlib으로 막대/선/히스토그램부터 산점도, 히트맵까지 그려봅니다. (채점은 그래프를 실제로 그렸는지, 그 안의 데이터가 맞는지를 코드로 확인하는 방식이에요)',
  exampleCode: `import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io, base64

categories = ['Class A', 'Class B', 'Class C']
averages = [88, 92, 79]

fig, ax = plt.subplots()
ax.bar(categories, averages)
ax.set_title('Average Score by Class')
ax.set_xlabel('Class')
ax.set_ylabel('Average Score')

buf = io.BytesIO()
fig.savefig(buf, format='png', bbox_inches='tight')
buf.seek(0)
img_b64 = base64.b64encode(buf.read()).decode('utf-8')
print(f"__IMAGE__:{img_b64}")
`,
  tiers: [
    {
      key: 'beginner',
      label: '초급',
      exercises: [
        {
          id: 'draw_bar_chart',
          prompt: '카테고리별 값을 막대그래프로 그리는 함수를 완성하세요. (채점은 막대의 높이가 정확한지 확인해요)',
          starterCode: `import matplotlib.pyplot as plt

def draw_bar_chart(categories, values):
    fig, ax = plt.subplots()
    # TODO: categories를 x축, values를 막대 높이로 하는 막대그래프를 그리세요
    return ax
`,
          assertion: `ax = draw_bar_chart(['A', 'B', 'C'], [10, 20, 15])
heights = [p.get_height() for p in ax.patches]
assert heights == [10, 20, 15], f"결과: {heights}"`,
          hint: 'ax.bar(categories, values)로 막대그래프를 그릴 수 있어요.',
          solutionCode: `import matplotlib.pyplot as plt

def draw_bar_chart(categories, values):
    fig, ax = plt.subplots()
    ax.bar(categories, values)
    return ax
`,
          solutionExplain: 'ax.bar()로 그린 막대들은 ax.patches에 저장돼요. 각 막대(patch)의 get_height()로 높이를 확인할 수 있습니다.',
        },
        {
          id: 'draw_line_chart',
          prompt: 'x, y 값으로 선그래프를 그리는 함수를 완성하세요.',
          starterCode: `import matplotlib.pyplot as plt

def draw_line_chart(x, y):
    fig, ax = plt.subplots()
    # TODO: x, y로 선그래프를 그리세요
    return ax
`,
          assertion: `ax = draw_line_chart([1, 2, 3], [10, 20, 15])
line = ax.lines[0]
assert list(line.get_ydata()) == [10, 20, 15], f"결과: {list(line.get_ydata())}"`,
          hint: 'ax.plot(x, y)로 선그래프를 그릴 수 있어요.',
          solutionCode: `import matplotlib.pyplot as plt

def draw_line_chart(x, y):
    fig, ax = plt.subplots()
    ax.plot(x, y)
    return ax
`,
          solutionExplain: 'ax.plot()으로 그린 선은 ax.lines에 저장돼요. get_ydata()로 그려진 y값들을 확인할 수 있습니다.',
        },
        {
          id: 'draw_histogram',
          prompt: '값들의 분포를 히스토그램으로 그리는 함수를 완성하세요. (bins는 막대 개수예요)',
          starterCode: `import matplotlib.pyplot as plt

def draw_histogram(values, bins):
    fig, ax = plt.subplots()
    # TODO: values를 bins개의 막대로 나눈 히스토그램을 그리세요
    return ax
`,
          assertion: `ax = draw_histogram([1, 2, 2, 3, 3, 3, 4, 5], 4)
assert len(ax.patches) == 4, f"막대 개수: {len(ax.patches)}"`,
          hint: 'ax.hist(values, bins=bins)로 히스토그램을 그릴 수 있어요.',
          solutionCode: `import matplotlib.pyplot as plt

def draw_histogram(values, bins):
    fig, ax = plt.subplots()
    ax.hist(values, bins=bins)
    return ax
`,
          solutionExplain: 'hist()도 내부적으로는 막대그래프라서 ax.patches에 막대들이 쌓여요. bins 개수만큼 막대가 생깁니다.',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'draw_labeled_chart',
          prompt: '선그래프를 그리고, 제목/x축이름/y축이름까지 붙이는 함수를 완성하세요.',
          starterCode: `import matplotlib.pyplot as plt

def draw_labeled_chart(x, y, title, xlabel, ylabel):
    fig, ax = plt.subplots()
    ax.plot(x, y)
    # TODO: title, xlabel, ylabel을 각각 설정하세요
    return ax
`,
          assertion: `ax = draw_labeled_chart([1, 2, 3], [1, 4, 9], 'my title', 'x axis', 'y axis')
assert ax.get_title() == 'my title', f"결과: {ax.get_title()}"
assert ax.get_xlabel() == 'x axis', f"결과: {ax.get_xlabel()}"
assert ax.get_ylabel() == 'y axis', f"결과: {ax.get_ylabel()}"`,
          hint: 'ax.set_title(title), ax.set_xlabel(xlabel), ax.set_ylabel(ylabel)을 각각 호출해보세요.',
          solutionCode: `import matplotlib.pyplot as plt

def draw_labeled_chart(x, y, title, xlabel, ylabel):
    fig, ax = plt.subplots()
    ax.plot(x, y)
    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    return ax
`,
          solutionExplain: '제목/축 이름이 없는 그래프는 보는 사람이 무슨 데이터인지 알기 어려워요. set_title/set_xlabel/set_ylabel은 실무에서도 거의 항상 붙이는 마무리 작업입니다.',
        },
        {
          id: 'create_two_subplots',
          prompt: '한 화면에 막대그래프(왼쪽)와 선그래프(오른쪽)를 나란히 그리는 함수를 완성하세요.',
          starterCode: `import matplotlib.pyplot as plt

def create_two_subplots(categories, values, x_line, y_line):
    fig, axes = plt.subplots(1, 2)
    # TODO: axes[0]에 막대그래프(categories, values), axes[1]에 선그래프(x_line, y_line)를 그리세요
    return fig
`,
          assertion: `fig = create_two_subplots(['A', 'B'], [10, 20], [1, 2, 3], [5, 10, 15])
assert len(fig.axes) == 2, f"서브플롯 개수: {len(fig.axes)}"
assert len(fig.axes[0].patches) == 2, "왼쪽에 막대그래프가 없어요"
assert len(fig.axes[1].lines) == 1, "오른쪽에 선그래프가 없어요"`,
          hint: "plt.subplots(1, 2)는 Axes 2개를 배열로 반환해요. axes[0], axes[1]에 각각 그래프를 그려보세요.",
          solutionCode: `import matplotlib.pyplot as plt

def create_two_subplots(categories, values, x_line, y_line):
    fig, axes = plt.subplots(1, 2)
    axes[0].bar(categories, values)
    axes[1].plot(x_line, y_line)
    return fig
`,
          solutionExplain: 'plt.subplots(nrows, ncols)로 여러 그래프를 한 화면에 배치할 수 있어요. fig.axes를 보면 그 안에 들어있는 모든 서브플롯을 확인할 수 있습니다.',
        },
        {
          id: 'draw_boxplot',
          prompt: '값들의 분포를 박스플롯으로 그리는 함수를 완성하세요.',
          starterCode: `import matplotlib.pyplot as plt

def draw_boxplot(values):
    fig, ax = plt.subplots()
    # TODO: values로 박스플롯을 그리고, 그 결과를 반환하세요
    pass
`,
          assertion: `result = draw_boxplot([10, 20, 30, 40, 50])
median_y = result['medians'][0].get_ydata()[0]
assert abs(median_y - 30) < 0.01, f"결과: {median_y}"`,
          hint: "ax.boxplot(values)를 호출하면 박스/수염/중앙값 등의 정보가 담긴 결과를 돌려줘요. 그 결과를 그대로 반환하세요.",
          solutionCode: `import matplotlib.pyplot as plt

def draw_boxplot(values):
    fig, ax = plt.subplots()
    bxp = ax.boxplot(values)
    return bxp
`,
          solutionExplain: "박스플롯은 최솟값/1사분위수/중앙값/3사분위수/최댓값을 한 번에 보여줘요. ax.boxplot()의 반환값에는 'medians' 같은 키로 각 요소에 접근할 수 있습니다.",
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'draw_scatter_with_trend',
          prompt: '산점도를 그리고, 데이터의 추세를 나타내는 직선(추세선)도 함께 그리는 함수를 완성하세요.',
          starterCode: `import numpy as np
import matplotlib.pyplot as plt

def draw_scatter_with_trend(x, y):
    fig, ax = plt.subplots()
    ax.scatter(x, y)
    # TODO: np.polyfit(x, y, 1)로 기울기/절편을 구해서 추세선을 그리세요
    return ax
`,
          assertion: `import numpy as np
ax = draw_scatter_with_trend([1, 2, 3, 4], [2, 4, 6, 8])
assert len(ax.collections) >= 1, "산점도가 없어요"
assert len(ax.lines) >= 1, "추세선이 없어요"
line_y = ax.lines[0].get_ydata()
expected_slope, expected_intercept = np.polyfit([1, 2, 3, 4], [2, 4, 6, 8], 1)
expected_y = [expected_slope * xi + expected_intercept for xi in [1, 2, 3, 4]]
assert all(abs(a - b) < 0.01 for a, b in zip(line_y, expected_y)), f"결과: {list(line_y)}"`,
          hint: 'np.polyfit(x, y, 1)은 (기울기, 절편)을 반환해요. 이 값으로 각 x에 대한 예상 y값을 계산해서 ax.plot()으로 그려보세요.',
          solutionCode: `import numpy as np
import matplotlib.pyplot as plt

def draw_scatter_with_trend(x, y):
    fig, ax = plt.subplots()
    ax.scatter(x, y)
    slope, intercept = np.polyfit(x, y, 1)
    trend_y = [slope * xi + intercept for xi in x]
    ax.plot(x, trend_y)
    return ax
`,
          solutionExplain: 'polyfit(x, y, 1)은 1차식(직선)으로 데이터에 가장 잘 맞는 기울기와 절편을 계산해줍니다. 산점도 위에 이 직선을 겹쳐 그리면 데이터의 경향을 한눈에 볼 수 있어요.',
        },
        {
          id: 'draw_correlation_heatmap',
          prompt: '여러 숫자형 컬럼 간의 상관관계를 계산하고, 히트맵(색으로 표현한 표)으로 그리는 함수를 완성하세요.',
          starterCode: `import pandas as pd
import matplotlib.pyplot as plt

def draw_correlation_heatmap(data):
    df = pd.DataFrame(data)
    corr = df.corr()
    fig, ax = plt.subplots()
    # TODO: corr을 imshow로 그려서, 그 이미지 객체를 반환하세요
    pass
`,
          assertion: `im = draw_correlation_heatmap({'a': [1, 2, 3, 4], 'b': [2, 4, 6, 8], 'c': [4, 3, 2, 1]})
arr = im.get_array()
assert abs(arr[0][0] - 1.0) < 0.01, f"결과: {arr}"
assert abs(arr[0][1] - 1.0) < 0.01, f"결과: {arr}"
assert abs(arr[0][2] - (-1.0)) < 0.01, f"결과: {arr}"`,
          hint: "ax.imshow(corr, cmap='coolwarm', vmin=-1, vmax=1)로 상관계수 표를 색으로 그릴 수 있어요.",
          solutionCode: `import pandas as pd
import matplotlib.pyplot as plt

def draw_correlation_heatmap(data):
    df = pd.DataFrame(data)
    corr = df.corr()
    fig, ax = plt.subplots()
    im = ax.imshow(corr, cmap='coolwarm', vmin=-1, vmax=1)
    return im
`,
          solutionExplain: 'corr()로 계산한 상관관계 표를 imshow로 그리면, 값이 클수록(양의 상관) 진하게, 작을수록(음의 상관) 다른 색으로 표시돼서 한눈에 변수들 간 관계를 비교할 수 있어요.',
        },
        {
          id: 'draw_grouped_boxplot',
          prompt: '두 그룹의 값을 나란히 박스플롯으로 비교하는 함수를 완성하세요.',
          starterCode: `import matplotlib.pyplot as plt

def draw_grouped_boxplot(group_a, group_b):
    fig, ax = plt.subplots()
    # TODO: group_a와 group_b를 나란히 박스플롯으로 그리고, 결과를 반환하세요
    pass
`,
          assertion: `result = draw_grouped_boxplot([10, 20, 30], [40, 50, 60])
assert len(result['boxes']) == 2, f"박스 개수: {len(result['boxes'])}"
median_a = result['medians'][0].get_ydata()[0]
median_b = result['medians'][1].get_ydata()[0]
assert abs(median_a - 20) < 0.01, f"결과: {median_a}"
assert abs(median_b - 50) < 0.01, f"결과: {median_b}"`,
          hint: "ax.boxplot([group_a, group_b])처럼 여러 그룹을 리스트로 묶어서 넘기면 나란히 그려줘요.",
          solutionCode: `import matplotlib.pyplot as plt

def draw_grouped_boxplot(group_a, group_b):
    fig, ax = plt.subplots()
    bxp = ax.boxplot([group_a, group_b])
    return bxp
`,
          solutionExplain: '여러 그룹의 분포를 한 화면에서 비교할 때 그룹별 박스플롯을 나란히 그리는 건 아주 표준적인 방법이에요. 반별/성별 등으로 나눈 데이터를 비교할 때 자주 씁니다.',
        },
      ],
    },
  ],
}
