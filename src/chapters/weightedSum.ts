import type { ChapterContent } from '../types/chapter'

export const weightedSum: ChapterContent = {
  chapterId: '02_weighted_sum',
  pyodidePackages: ['numpy'],
  description:
    '인공신경망의 뉴런 하나가 하는 일이 바로 이거예요 — 입력값에 가중치를 곱해서 더하는 "가중합". 같은 입력이라도 가중치가 달라지면 결과가 완전히 달라져요. 이 챕터에서 그 감각을 직접 계산해보며 익힙니다.',
  exampleCode: `import numpy as np

inputs = np.array([1, 2, 3])
weights = np.array([0.2, 0.5, 0.3])

weighted_sum = np.dot(inputs, weights)
print('입력:', inputs)
print('가중치:', weights)
print('가중합:', weighted_sum)
`,
  tiers: [
    {
      key: 'beginner',
      label: '초급',
      exercises: [
        {
          id: 'weighted_sum_basic',
          prompt: '입력값과 가중치를 받아, 가중합(각 입력×가중치의 합)을 계산해서 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def weighted_sum_basic(inputs, weights):
    x = np.array(inputs)
    w = np.array(weights)
    # TODO: 가중합을 계산해서 반환하세요
    pass
`,
          assertion: `assert weighted_sum_basic([1, 2, 3], [0.5, 0.5, 1]) == 4.5`,
          hint: 'np.dot(x, w)로 가중합을 한 번에 계산할 수 있어요. 챕터1에서 배운 내적(dot product)과 완전히 같은 연산이에요.',
          solutionCode: `import numpy as np

def weighted_sum_basic(inputs, weights):
    x = np.array(inputs)
    w = np.array(weights)
    return float(np.dot(x, w))
`,
          solutionExplain: '가중합은 사실 내적이에요! (1×0.5 + 2×0.5 + 3×1 = 4.5). AI는 이 계산을 "이 입력이 얼마나 중요한 신호인지"를 종합하는 데 씁니다.',
        },
        {
          id: 'weighted_sum_with_bias',
          prompt: '가중합에 편향(bias)까지 더한 값을 반환하는 함수를 완성하세요. (실제 뉴런의 계산식: 가중합 + bias)',
          starterCode: `import numpy as np

def weighted_sum_with_bias(inputs, weights, bias):
    x = np.array(inputs)
    w = np.array(weights)
    # TODO: 가중합에 bias를 더한 값을 반환하세요
    pass
`,
          assertion: `assert weighted_sum_with_bias([1, 2], [2, 3], 1) == 9.0`,
          hint: 'np.dot(x, w) + bias 형태로 계산해보세요.',
          solutionCode: `import numpy as np

def weighted_sum_with_bias(inputs, weights, bias):
    x = np.array(inputs)
    w = np.array(weights)
    return float(np.dot(x, w) + bias)
`,
          solutionExplain: 'bias(편향)는 가중합에 더해지는 상수예요. 입력이 전부 0이어도 뉴런이 어느 정도 값을 낼 수 있게 해주는, 뉴런 계산의 기본 구성요소입니다.',
        },
        {
          id: 'normalize_weights',
          prompt: '가중치들의 합이 1이 되도록 정규화한 리스트를 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def normalize_weights(weights):
    w = np.array(weights)
    # TODO: 합이 1이 되도록 정규화한 리스트를 반환하세요
    pass
`,
          assertion: `assert normalize_weights([1, 1, 2]) == [0.25, 0.25, 0.5]`,
          hint: '각 가중치를 전체 합(w.sum())으로 나눠보세요.',
          solutionCode: `import numpy as np

def normalize_weights(weights):
    w = np.array(weights)
    return (w / w.sum()).tolist()
`,
          solutionExplain: '가중치의 합을 1로 맞추면, 각 가중치를 "전체에서 차지하는 비율"로 해석할 수 있게 돼요. 다음 문제(가중평균)에서 바로 이 성질을 사용합니다.',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'weighted_average',
          prompt: '값(values)과 가중치(weights)로 가중평균을 계산해서 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def weighted_average(values, weights):
    v = np.array(values)
    w = np.array(weights)
    # TODO: 가중평균 ( (값×가중치의 합) / 가중치의 합 ) 을 반환하세요
    pass
`,
          assertion: `assert weighted_average([80, 90, 100], [1, 1, 2]) == 92.5`,
          hint: '가중합(np.dot(v, w))을 가중치의 합(w.sum())으로 나눠보세요.',
          solutionCode: `import numpy as np

def weighted_average(values, weights):
    v = np.array(values)
    w = np.array(weights)
    return float(np.dot(v, w) / w.sum())
`,
          solutionExplain: '단순 평균은 모든 값을 똑같이 취급하지만, 가중평균은 더 중요한 값에 더 큰 비중을 줘요. 예를 들어 100점짜리 항목에 가중치 2를 주면, 그 항목이 최종 점수에 두 배로 반영됩니다.',
        },
        {
          id: 'batch_weighted_sum',
          prompt: '여러 개의 입력 샘플(행렬)에 대해, 각 샘플의 가중합을 한 번에 계산해서 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def batch_weighted_sum(inputs_batch, weights):
    X = np.array(inputs_batch)
    w = np.array(weights)
    # TODO: 각 행(샘플)마다 가중합을 계산해서 리스트로 반환하세요
    pass
`,
          assertion: `assert batch_weighted_sum([[1, 2], [3, 4]], [1, 2]) == [5, 11]`,
          hint: '행렬 X와 벡터 w를 X @ w로 곱하면, 각 행마다 가중합이 한 번에 계산돼요.',
          solutionCode: `import numpy as np

def batch_weighted_sum(inputs_batch, weights):
    X = np.array(inputs_batch)
    w = np.array(weights)
    return (X @ w).tolist()
`,
          solutionExplain: 'AI 모델은 데이터를 하나씩 처리하지 않고 여러 개(배치)를 한 번에 처리해요. 행렬×벡터 곱셈이 바로 "여러 샘플의 가중합을 한 번에 계산"하는 방법입니다.',
        },
        {
          id: 'multi_output_weighted_sum',
          prompt: '하나의 입력에 대해, 여러 개의 출력(뉴런)을 동시에 계산하는 함수를 완성하세요. weight_matrix의 각 행이 하나의 출력에 대응하는 가중치예요.',
          starterCode: `import numpy as np

def multi_output_weighted_sum(inputs, weight_matrix):
    x = np.array(inputs)
    W = np.array(weight_matrix)
    # TODO: 각 출력(W의 각 행)마다 가중합을 계산해서 리스트로 반환하세요
    pass
`,
          assertion: `assert multi_output_weighted_sum([1, 2], [[1, 1], [2, 0]]) == [3, 2]`,
          hint: 'W @ x로 행렬과 벡터를 곱하면, W의 각 행과 x의 내적이 한 번에 계산돼요.',
          solutionCode: `import numpy as np

def multi_output_weighted_sum(inputs, weight_matrix):
    x = np.array(inputs)
    W = np.array(weight_matrix)
    return (W @ x).tolist()
`,
          solutionExplain: '신경망의 한 "층(layer)"은 보통 여러 개의 뉴런으로 이루어져 있어요. 각 뉴런마다 다른 가중치를 가지고 같은 입력을 받아 서로 다른 출력을 계산하는데, 이걸 행렬곱 한 번으로 표현한 거예요.',
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'relu_activation',
          prompt: '값들에 ReLU 활성화 함수(음수는 0으로, 양수는 그대로)를 적용한 리스트를 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def relu_activation(values):
    v = np.array(values)
    # TODO: 음수는 0으로 바꾸고, 양수는 그대로 두어 리스트로 반환하세요
    pass
`,
          assertion: `assert relu_activation([-2, -1, 0, 1, 2]) == [0, 0, 0, 1, 2]`,
          hint: 'np.maximum(0, v)를 쓰면 각 값과 0 중 더 큰 값을 골라줘요.',
          solutionCode: `import numpy as np

def relu_activation(values):
    v = np.array(values)
    return np.maximum(0, v).tolist()
`,
          solutionExplain: 'ReLU(Rectified Linear Unit)는 가중합을 계산한 뒤 적용하는 가장 널리 쓰이는 활성화 함수예요. 음수 신호는 0으로 꺼버리고, 양수 신호만 그대로 통과시킵니다.',
        },
        {
          id: 'simple_perceptron',
          prompt: '가중합+bias가 0 이상이면 1, 아니면 0을 반환하는 간단한 퍼셉트론(perceptron) 함수를 완성하세요.',
          starterCode: `import numpy as np

def simple_perceptron(inputs, weights, bias):
    x = np.array(inputs)
    w = np.array(weights)
    z = np.dot(x, w) + bias
    # TODO: z가 0 이상이면 1, 아니면 0을 반환하세요
    pass
`,
          assertion: `assert simple_perceptron([1, 1], [1, 1], -1.5) == 1
assert simple_perceptron([0, 0], [1, 1], -1.5) == 0`,
          hint: 'if z >= 0: return 1 형태의 조건문을 써보세요.',
          solutionCode: `import numpy as np

def simple_perceptron(inputs, weights, bias):
    x = np.array(inputs)
    w = np.array(weights)
    z = np.dot(x, w) + bias
    return 1 if z >= 0 else 0
`,
          solutionExplain: '퍼셉트론은 가장 단순한 형태의 인공 뉴런이에요: 가중합을 계산하고, 그 값이 기준(보통 0)을 넘으면 "활성화"(1), 못 넘으면 "비활성화"(0)로 판단합니다. 이게 모든 신경망의 출발점이에요.',
        },
        {
          id: 'compare_weight_effect',
          prompt: '같은 입력에 대해 서로 다른 두 가중치(weights_a, weights_b)로 각각 가중합을 계산해서, 어느 쪽이 더 큰 값을 내는지(\'A\', \'B\', \'equal\') 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def compare_weight_effect(inputs, weights_a, weights_b):
    x = np.array(inputs)
    sum_a = np.dot(x, np.array(weights_a))
    sum_b = np.dot(x, np.array(weights_b))
    # TODO: sum_a와 sum_b를 비교해서 'A', 'B', 'equal' 중 하나를 반환하세요
    pass
`,
          assertion: `assert compare_weight_effect([1, 2, 3], [1, 1, 1], [0, 0, 1]) == 'A'`,
          hint: 'if sum_a > sum_b: return \'A\' 처럼 두 값을 비교하는 조건문을 써보세요.',
          solutionCode: `import numpy as np

def compare_weight_effect(inputs, weights_a, weights_b):
    x = np.array(inputs)
    sum_a = np.dot(x, np.array(weights_a))
    sum_b = np.dot(x, np.array(weights_b))
    if sum_a > sum_b:
        return 'A'
    elif sum_b > sum_a:
        return 'B'
    else:
        return 'equal'
`,
          solutionExplain: '이 챕터의 핵심이에요 — 입력은 완전히 똑같아도, 가중치가 다르면 결과가 크게 달라져요. AI 모델을 "학습"시킨다는 건, 결국 원하는 결과가 나오도록 이 가중치들을 조금씩 바꿔나가는 과정입니다.',
        },
      ],
    },
  ],
}
