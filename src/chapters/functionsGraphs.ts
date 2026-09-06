import type { ChapterContent } from '../types/chapter'

export const functionsGraphs: ChapterContent = {
  chapterId: '03_functions_graphs',
  pyodidePackages: ['numpy', 'matplotlib'],
  description:
    '함수는 "입력을 넣으면 출력이 나오는 규칙"이에요. 선형/지수/로그/Sigmoid, 이 4가지 함수가 입력을 어떻게 다른 모양의 출력으로 바꾸는지 직접 계산하고 그래프로 확인해봅니다.',
  exampleCode: `import matplotlib
matplotlib.use('Agg')
import numpy as np
import matplotlib.pyplot as plt
import io, base64

x = np.linspace(-5, 5, 100)
y = 1 / (1 + np.exp(-x))

fig, ax = plt.subplots()
ax.plot(x, y)
ax.set_title('Sigmoid Function')
ax.set_xlabel('x')
ax.set_ylabel('sigmoid(x)')

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
          id: 'linear_function',
          prompt: '선형함수 y = a×x + b를 계산해서 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def linear_function(x_values, a, b):
    x = np.array(x_values)
    # TODO: y = a*x + b를 계산해서 리스트로 반환하세요
    pass
`,
          assertion: `assert linear_function([0, 1, 2], 2, 1) == [1, 3, 5]`,
          hint: 'y = a * x + b 형태로 그대로 계산해보세요. NumPy는 이 계산을 배열 전체에 한 번에 적용해줘요.',
          solutionCode: `import numpy as np

def linear_function(x_values, a, b):
    x = np.array(x_values)
    y = a * x + b
    return y.tolist()
`,
          solutionExplain: '선형함수는 입력이 일정하게 늘어나면 출력도 일정하게 늘어나는, 가장 단순하고 예측하기 쉬운 함수예요.',
        },
        {
          id: 'exponential_function',
          prompt: '지수함수 y = e^x를 계산해서 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def exponential_function(x_values):
    x = np.array(x_values)
    # TODO: y = e^x를 계산해서 리스트로 반환하세요
    pass
`,
          assertion: `result = exponential_function([0, 1])
assert abs(result[0] - 1.0) < 0.001
assert abs(result[1] - 2.71828) < 0.001`,
          hint: 'np.exp(x)로 e를 밑으로 하는 지수함수를 계산할 수 있어요.',
          solutionCode: `import numpy as np

def exponential_function(x_values):
    x = np.array(x_values)
    y = np.exp(x)
    return y.tolist()
`,
          solutionExplain: '지수함수는 입력이 조금만 커져도 출력이 급격하게 커지는 특징이 있어요. e^0=1, e^1≈2.718처럼 커지는 속도가 점점 빨라집니다.',
        },
        {
          id: 'log_function',
          prompt: '로그함수(자연로그) y = ln(x)를 계산해서 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def log_function(x_values):
    x = np.array(x_values)
    # TODO: y = ln(x)를 계산해서 리스트로 반환하세요
    pass
`,
          assertion: `import math
result = log_function([1, math.e])
assert abs(result[0] - 0.0) < 0.001
assert abs(result[1] - 1.0) < 0.001`,
          hint: 'np.log(x)는 자연로그(밑이 e인 로그)를 계산해줘요.',
          solutionCode: `import numpy as np

def log_function(x_values):
    x = np.array(x_values)
    y = np.log(x)
    return y.tolist()
`,
          solutionExplain: '로그함수는 지수함수와 반대 방향으로 동작해요 — 입력이 아주 커져도 출력은 아주 천천히 커집니다. 그래서 값의 범위가 너무 넓은 데이터를 다룰 때 로그를 자주 씁니다.',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'plot_linear_vs_exponential',
          prompt: '같은 x값에 대해 선형함수와 지수함수를 한 그래프에 겹쳐 그리는 함수를 완성하세요.',
          starterCode: `import numpy as np
import matplotlib.pyplot as plt

def plot_linear_vs_exponential(x_values, a, b):
    x = np.array(x_values)
    linear_y = a * x + b
    exp_y = np.exp(x)
    fig, ax = plt.subplots()
    # TODO: linear_y와 exp_y를 각각 선그래프로 그리세요
    return ax
`,
          assertion: `ax = plot_linear_vs_exponential([0, 1, 2], 2, 1)
assert len(ax.lines) == 2, "선이 2개 있어야 해요"
line1_y = ax.lines[0].get_ydata()
line2_y = ax.lines[1].get_ydata()
assert list(line1_y) == [1, 3, 5], f"결과: {list(line1_y)}"
assert all(abs(a - b) < 0.01 for a, b in zip(line2_y, [1, 2.71828, 7.389056])), f"결과: {list(line2_y)}"`,
          hint: 'ax.plot(x, linear_y)와 ax.plot(x, exp_y)를 순서대로 호출하면 한 그래프 안에 두 선이 겹쳐 그려져요.',
          solutionCode: `import numpy as np
import matplotlib.pyplot as plt

def plot_linear_vs_exponential(x_values, a, b):
    x = np.array(x_values)
    linear_y = a * x + b
    exp_y = np.exp(x)
    fig, ax = plt.subplots()
    ax.plot(x, linear_y, label='linear')
    ax.plot(x, exp_y, label='exponential')
    return ax
`,
          solutionExplain: '두 함수를 같은 그래프에 겹쳐 그리면, 지수함수가 선형함수보다 훨씬 빠르게 커진다는 걸 눈으로 바로 확인할 수 있어요.',
        },
        {
          id: 'sigmoid_function',
          prompt: 'Sigmoid 함수 y = 1 / (1 + e^(-x))를 계산해서 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def sigmoid_function(x_values):
    x = np.array(x_values)
    # TODO: sigmoid 함수를 계산해서 리스트로 반환하세요
    pass
`,
          assertion: `result = sigmoid_function([0, 10, -10])
assert abs(result[0] - 0.5) < 0.001
assert result[1] > 0.99
assert result[2] < 0.01`,
          hint: '1 / (1 + np.exp(-x)) 공식을 그대로 코드로 옮겨보세요.',
          solutionCode: `import numpy as np

def sigmoid_function(x_values):
    x = np.array(x_values)
    y = 1 / (1 + np.exp(-x))
    return y.tolist()
`,
          solutionExplain: 'Sigmoid는 어떤 입력이 와도 출력을 항상 0과 1 사이로 눌러 담아줘요. x=0일 때 정확히 0.5이고, x가 커질수록 1에, 작아질수록 0에 가까워집니다. "확률"이나 "on/off 판단"을 표현할 때 아주 많이 쓰여요.',
        },
        {
          id: 'plot_sigmoid',
          prompt: 'Sigmoid 함수 곡선을 그리는 함수를 완성하세요.',
          starterCode: `import numpy as np
import matplotlib.pyplot as plt

def plot_sigmoid(x_values):
    x = np.array(x_values)
    y = 1 / (1 + np.exp(-x))
    fig, ax = plt.subplots()
    # TODO: x, y로 선그래프를 그리세요
    return ax
`,
          assertion: `ax = plot_sigmoid([-2, -1, 0, 1, 2])
line_y = ax.lines[0].get_ydata()
assert abs(line_y[2] - 0.5) < 0.001, f"결과: {list(line_y)}"
assert line_y[0] < line_y[2] < line_y[4], f"결과: {list(line_y)}"`,
          hint: 'ax.plot(x, y)로 그려보세요.',
          solutionCode: `import numpy as np
import matplotlib.pyplot as plt

def plot_sigmoid(x_values):
    x = np.array(x_values)
    y = 1 / (1 + np.exp(-x))
    fig, ax = plt.subplots()
    ax.plot(x, y)
    return ax
`,
          solutionExplain: 'Sigmoid 그래프는 완만한 S자 모양이에요. 가운데(x=0)에서 가장 가파르게 변하고, 양쪽 끝에서는 거의 평평해집니다.',
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'compare_function_growth',
          prompt: '선형함수(a×x)와 지수함수(e^x) 중 특정 x에서 어느 쪽이 더 큰 값을 내는지 (\'linear\', \'exponential\', \'equal\') 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def compare_function_growth(x, a):
    linear_y = a * x
    exp_y = np.exp(x)
    # TODO: linear_y와 exp_y를 비교해서 'linear', 'exponential', 'equal' 중 하나를 반환하세요
    pass
`,
          assertion: `assert compare_function_growth(1, 10) == 'linear'
assert compare_function_growth(5, 10) == 'exponential'`,
          hint: 'if linear_y > exp_y: return \'linear\' 처럼 두 값을 비교해보세요.',
          solutionCode: `import numpy as np

def compare_function_growth(x, a):
    linear_y = a * x
    exp_y = np.exp(x)
    if linear_y > exp_y:
        return 'linear'
    elif exp_y > linear_y:
        return 'exponential'
    else:
        return 'equal'
`,
          solutionExplain: 'x=1일 땐 기울기 10인 선형함수(10)가 지수함수(2.7)보다 커요. 하지만 x=5가 되면 지수함수(148.4)가 선형함수(50)를 역전해버려요. 지수함수는 아무리 완만한 선형함수라도 결국은 앞질러버립니다.',
        },
        {
          id: 'relu_vs_sigmoid',
          prompt: 'ReLU 함수와 Sigmoid 함수를 같은 그래프에 겹쳐 그리는 함수를 완성하세요.',
          starterCode: `import numpy as np
import matplotlib.pyplot as plt

def relu_vs_sigmoid(x_values):
    x = np.array(x_values)
    relu_y = np.maximum(0, x)
    sigmoid_y = 1 / (1 + np.exp(-x))
    fig, ax = plt.subplots()
    # TODO: relu_y와 sigmoid_y를 각각 선그래프로 그리세요
    return ax
`,
          assertion: `ax = relu_vs_sigmoid([-2, -1, 0, 1, 2])
assert len(ax.lines) == 2
relu_data = ax.lines[0].get_ydata()
sigmoid_data = ax.lines[1].get_ydata()
assert list(relu_data) == [0, 0, 0, 1, 2], f"결과: {list(relu_data)}"
assert abs(sigmoid_data[2] - 0.5) < 0.001, f"결과: {list(sigmoid_data)}"`,
          hint: '지난 챕터에서 배운 ReLU(np.maximum(0, x))와 이번 챕터의 sigmoid를 각각 ax.plot()으로 그려보세요.',
          solutionCode: `import numpy as np
import matplotlib.pyplot as plt

def relu_vs_sigmoid(x_values):
    x = np.array(x_values)
    relu_y = np.maximum(0, x)
    sigmoid_y = 1 / (1 + np.exp(-x))
    fig, ax = plt.subplots()
    ax.plot(x, relu_y, label='relu')
    ax.plot(x, sigmoid_y, label='sigmoid')
    return ax
`,
          solutionExplain: 'ReLU는 직선을 반으로 꺾은 모양, Sigmoid는 부드러운 S자 모양이에요. 둘 다 신경망에서 활성화 함수로 쓰이지만 모양과 특성이 전혀 달라요 — 이런 차이가 모델의 학습 방식에 영향을 줍니다.',
        },
        {
          id: 'sigmoid_derivative_at_zero',
          prompt: 'x=0에서 Sigmoid 함수의 기울기(미분값)를 아주 작은 변화량(delta)으로 근사 계산해서 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def sigmoid_derivative_at_zero():
    def sigmoid(x):
        return 1 / (1 + np.exp(-x))
    delta = 1e-5
    # TODO: (sigmoid(delta) - sigmoid(-delta)) / (2*delta)로 기울기를 근사해서 반환하세요
    pass
`,
          assertion: `result = sigmoid_derivative_at_zero()
assert abs(result - 0.25) < 0.001, f"결과: {result}"`,
          hint: '기울기(변화율)는 (조금 앞으로 간 값 - 조금 뒤로 간 값) / (그 차이의 2배)로 근사할 수 있어요.',
          solutionCode: `import numpy as np

def sigmoid_derivative_at_zero():
    def sigmoid(x):
        return 1 / (1 + np.exp(-x))
    delta = 1e-5
    derivative = (sigmoid(delta) - sigmoid(-delta)) / (2 * delta)
    return float(derivative)
`,
          solutionExplain: '이렇게 아주 작은 변화량으로 기울기를 근사하는 방법을 "수치미분"이라고 해요. Sigmoid는 x=0에서 기울기가 정확히 0.25인데, 이 값이 바로 신경망이 "얼마나 크게 값을 조정할지" 정하는 데 쓰이는 정보예요 (경사하강법의 기초).',
        },
      ],
    },
  ],
}
