import type { ChapterContent } from '../types/chapter'

export const vectorsMatrices: ChapterContent = {
  chapterId: '01_vectors_matrices',
  pyodidePackages: ['numpy'],
  description:
    'AI는 데이터를 숫자들의 배열(벡터/행렬)로 다뤄요. NumPy로 벡터와 행렬을 직접 만들어보고, 더하고 곱하는 연산을 통해 데이터가 어떻게 결합되는지 감을 잡아봅니다.',
  exampleCode: `import numpy as np

vector = np.array([1, 2, 3])
matrix = np.array([[1, 2], [3, 4]])

print('벡터:', vector, '/ shape:', vector.shape)
print('행렬:\\n', matrix, '/ shape:', matrix.shape)
print('행렬 전치:\\n', matrix.T)
`,
  tiers: [
    {
      key: 'beginner',
      label: '초급',
      exercises: [
        {
          id: 'vector_shape',
          prompt: '리스트로 벡터(1차원 배열)를 만들고, 그 크기(shape)를 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def vector_shape(values):
    v = np.array(values)
    # TODO: v의 shape를 반환하세요
    pass
`,
          assertion: `assert vector_shape([1, 2, 3]) == (3,)`,
          hint: 'np.array()로 만든 배열은 .shape 속성으로 크기를 확인할 수 있어요.',
          solutionCode: `import numpy as np

def vector_shape(values):
    v = np.array(values)
    return v.shape
`,
          solutionExplain: 'shape는 배열의 각 차원 크기를 튜플로 알려줘요. 1차원 벡터는 (원소 개수,) 형태로 나옵니다.',
        },
        {
          id: 'matrix_shape',
          prompt: '중첩 리스트로 행렬(2차원 배열)을 만들고, (행 개수, 열 개수)를 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def matrix_shape(values):
    m = np.array(values)
    # TODO: m의 shape를 반환하세요
    pass
`,
          assertion: `assert matrix_shape([[1, 2, 3], [4, 5, 6]]) == (2, 3)`,
          hint: '행렬도 벡터와 마찬가지로 .shape로 크기를 확인해요. (행, 열) 순서로 나와요.',
          solutionCode: `import numpy as np

def matrix_shape(values):
    m = np.array(values)
    return m.shape
`,
          solutionExplain: '2행 3열 행렬의 shape는 (2, 3)이에요. 데이터를 표로 생각하면 행은 "몇 개의 데이터", 열은 "몇 개의 특징(feature)"에 해당해요.',
        },
        {
          id: 'vector_add',
          prompt: '두 벡터를 같은 위치끼리 더한 결과를 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def vector_add(a, b):
    va = np.array(a)
    vb = np.array(b)
    # TODO: va와 vb를 더한 결과를 리스트로 반환하세요
    pass
`,
          assertion: `assert vector_add([1, 2, 3], [10, 20, 30]) == [11, 22, 33]`,
          hint: 'NumPy 배열끼리는 +로 바로 각 위치별 덧셈이 돼요 (반복문 필요 없어요). .tolist()로 리스트로 바꿀 수 있어요.',
          solutionCode: `import numpy as np

def vector_add(a, b):
    va = np.array(a)
    vb = np.array(b)
    return (va + vb).tolist()
`,
          solutionExplain: 'NumPy 배열은 파이썬 리스트와 달리 +, -, *, / 연산이 각 위치(원소)별로 자동으로 적용돼요. 이걸 "벡터화 연산"이라고 부릅니다.',
        },
      ],
    },
    {
      key: 'intermediate',
      label: '중급',
      exercises: [
        {
          id: 'matrix_transpose',
          prompt: '행렬을 전치(행과 열을 뒤바꿈)한 결과를 중첩 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def matrix_transpose(values):
    m = np.array(values)
    # TODO: m을 전치한 결과를 중첩 리스트로 반환하세요
    pass
`,
          assertion: `assert matrix_transpose([[1, 2, 3], [4, 5, 6]]) == [[1, 4], [2, 5], [3, 6]]`,
          hint: '.T 속성으로 행렬을 전치할 수 있어요. .tolist()로 중첩 리스트로 바꿔보세요.',
          solutionCode: `import numpy as np

def matrix_transpose(values):
    m = np.array(values)
    return m.T.tolist()
`,
          solutionExplain: '전치는 행과 열을 서로 바꾸는 연산이에요. (2, 3) 모양 행렬을 전치하면 (3, 2) 모양이 됩니다.',
        },
        {
          id: 'dot_product',
          prompt: '두 벡터의 내적(dot product)을 계산해서 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def dot_product(a, b):
    # TODO: a와 b의 내적을 계산해서 반환하세요
    pass
`,
          assertion: `assert dot_product([1, 2, 3], [4, 5, 6]) == 32.0`,
          hint: 'np.dot(a, b)로 내적을 구할 수 있어요. 각 위치의 값을 곱한 뒤 전부 더한 값이에요.',
          solutionCode: `import numpy as np

def dot_product(a, b):
    return float(np.dot(a, b))
`,
          solutionExplain: '내적은 (1×4 + 2×5 + 3×6 = 32)처럼 두 벡터의 대응하는 값을 곱해서 모두 더한 값이에요. 다음 챕터에서 배울 "가중합"의 핵심 연산이 바로 이 내적입니다.',
        },
        {
          id: 'matrix_multiply',
          prompt: '두 행렬을 곱한 결과를 중첩 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def matrix_multiply(a, b):
    ma = np.array(a)
    mb = np.array(b)
    # TODO: ma와 mb를 행렬곱한 결과를 중첩 리스트로 반환하세요
    pass
`,
          assertion: `assert matrix_multiply([[1, 2], [3, 4]], [[5, 6], [7, 8]]) == [[19, 22], [43, 50]]`,
          hint: '@ 연산자나 np.dot(ma, mb)로 행렬곱을 계산할 수 있어요. (* 연산자는 원소별 곱셈이라 다른 결과가 나오니 주의하세요.)',
          solutionCode: `import numpy as np

def matrix_multiply(a, b):
    ma = np.array(a)
    mb = np.array(b)
    return (ma @ mb).tolist()
`,
          solutionExplain: '행렬곱은 각 행과 각 열 사이의 내적을 모아놓은 연산이에요. @ 연산자는 NumPy에서 행렬곱을 뜻하고, * 연산자(원소별 곱셈)와는 전혀 다른 결과를 줘요.',
        },
      ],
    },
    {
      key: 'advanced',
      label: '고급',
      exercises: [
        {
          id: 'scalar_multiply_matrix',
          prompt: '행렬의 모든 원소에 스칼라(하나의 숫자)를 곱한 결과를 중첩 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def scalar_multiply_matrix(values, scalar):
    m = np.array(values)
    # TODO: m의 모든 원소에 scalar를 곱한 결과를 중첩 리스트로 반환하세요
    pass
`,
          assertion: `assert scalar_multiply_matrix([[1, 2], [3, 4]], 2) == [[2, 4], [6, 8]]`,
          hint: 'NumPy 배열에 그냥 숫자를 곱하면 (m * scalar), 모든 원소에 자동으로 적용돼요.',
          solutionCode: `import numpy as np

def scalar_multiply_matrix(values, scalar):
    m = np.array(values)
    return (m * scalar).tolist()
`,
          solutionExplain: '스칼라 곱은 행렬의 모든 원소를 같은 비율로 키우거나 줄이는 연산이에요. 이미지의 밝기 조절 같은 것도 이 원리를 씁니다.',
        },
        {
          id: 'identity_check',
          prompt: '정사각행렬에 그 크기와 같은 항등행렬(identity matrix)을 곱해서, 원래와 같은 결과가 나오는지 확인하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def identity_check(values):
    m = np.array(values)
    n = m.shape[0]
    # TODO: n×n 크기의 항등행렬을 만들어서 m과 곱한 결과를 반환하세요
    pass
`,
          assertion: `assert identity_check([[1, 2], [3, 4]]) == [[1.0, 2.0], [3.0, 4.0]]`,
          hint: 'np.eye(n)으로 n×n 항등행렬(대각선만 1, 나머지는 0)을 만들 수 있어요. 이 행렬을 곱해도 원래 행렬이 그대로 나와야 해요.',
          solutionCode: `import numpy as np

def identity_check(values):
    m = np.array(values)
    n = m.shape[0]
    identity = np.eye(n)
    return (m @ identity).tolist()
`,
          solutionExplain: '항등행렬은 숫자에서의 1과 같은 역할을 해요. 어떤 행렬에 항등행렬을 곱해도 그 행렬은 변하지 않습니다.',
        },
        {
          id: 'normalize_vector',
          prompt: '벡터를 그 크기(L2 노름)로 나눠서 정규화한 결과를 리스트로 반환하는 함수를 완성하세요.',
          starterCode: `import numpy as np

def normalize_vector(values):
    v = np.array(values)
    # TODO: v를 그 크기(L2 노름)로 나눈 결과를 리스트로 반환하세요
    pass
`,
          assertion: `result = normalize_vector([3, 4])
assert abs(result[0] - 0.6) < 0.001 and abs(result[1] - 0.8) < 0.001, f"결과: {result}"`,
          hint: 'np.linalg.norm(v)로 벡터의 크기(길이)를 구할 수 있어요. v를 그 크기로 나누면 길이가 1인 벡터가 됩니다.',
          solutionCode: `import numpy as np

def normalize_vector(values):
    v = np.array(values)
    norm = np.linalg.norm(v)
    return (v / norm).tolist()
`,
          solutionExplain: '정규화(normalize)는 벡터의 방향은 그대로 두고 길이만 1로 맞추는 연산이에요. [3, 4]는 길이가 5(3-4-5 직각삼각형)라서, 정규화하면 [0.6, 0.8]이 됩니다. 머신러닝에서 데이터 크기를 맞출 때 자주 쓰여요.',
        },
      ],
    },
  ],
}
