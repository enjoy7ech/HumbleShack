---
title: DP经典-LCS与LIS问题
date: 2022-04-03 17:11:43
tags: [算法, 动态规划]
categories: 算法之路
keywords: 动态规划,LCS,LIS
description: 一文全撸二叉树
thumbnail: https://pan.dongzx.lol/api/v4/file/content/V3wu9/0/LCS&LIS.png?sign=wVHBsz59tQkdnqbk_KKDre9CSJ03nf9d2EQN6ApMGmo%3D%3A0
top_img: https://pan.dongzx.lol/api/v4/file/content/V3wu9/0/LCS&LIS.png?sign=wVHBsz59tQkdnqbk_KKDre9CSJ03nf9d2EQN6ApMGmo%3D%3A0
cover: https://pan.dongzx.lol/api/v4/file/content/V3wu9/0/LCS&LIS.png?sign=wVHBsz59tQkdnqbk_KKDre9CSJ03nf9d2EQN6ApMGmo%3D%3A0
excerpt: 记录下经典的动态规划问题，最长公共子序列与最长递增子序列问题。
---

## 动态规划

动态规划 `Dynamic Programming`，是一种解决复杂问题的算法设计技术。它的核心思想是将一个大问题拆分成多个小问题，然后通过存储和重复利用数据来提高算法的效率。动态规划的目标是保留先前计算过的值，以提高时间效率。

动态规划并不是一个特定的算法，而是一种解决问题的思维方式。它可以应用于各种问题，从简单的变量到复杂的数据结构和算法。动态规划的关键是识别何时可以使用简单的变量或需要复杂的数据结构或算法来设计最优解。

动态规划的一个重要概念是 `记忆化`，即通过存储先前计算过的值来避免重复计算。这种设计技术称为"memoization"。

动态规划说起来很玄妙，其实刷下来感觉就是一颗问题树，从上往下的解决是递归的思想，比较符合逻辑思维。但是会有许多重复子问题 `需要人为的去缓存子问题的解，羡慕python的@cache装饰器🐻`，这是自顶向下的过程。而动态规划就是直接从叶子节点开始算，一步步的往上推，是自底向上的过程。有的时候直接去找递推关系是真的没思路，其实应该先自顶向下的考虑问题 `这样比较符合一般逻辑思维`，然后通过递归改循环的方法，直接就写出了动态规划的算法了 `相信你的递归，剩下的交给dp，脑子一丢开始写🤣🤣`。

## 条件

动态规划的使用条件包括：

1. 子问题重叠：问题可以被分解成更小的子问题，这些子问题之间存在重叠，即它们需要先前计算的值。`其实就是递归可以往下走的必要条件`
2. 最优子结构：问题的最优解可以通过子问题的最优解来构建。这意味着可以通过解决子问题来找到整体问题的最优解。`其实就是递归可以往上返回的必要条件`

## 初始状态

比较重要的是 `初始状态`的设定，这个带到递归程序里想想就可以了。`其实就是递归的出口条件`

## 举个 🌰

### 01 背包问题

```text
有 n 件物品和一个最多能背重量为 cap 的背包。第 i 件物品的重量是 weight[i]，得到的价值是 value[i] 。
每件物品只能用一次，求解将哪些物品装入背包里物品价值总和最大。
输入：
weight = [10, 20, 30, 40, 50], value = [50, 120, 150, 210, 240], cap = 50
```

01 背包问题是个 经典的 DP 问题，问题的核心在于 `选还是不选`，因此从第 1-n 个物品种选出 n 个物品可以有{% katex %}2^n{% endkatex %}种选法，从中选出符合条件的 `总重量小于背包容量w`的方法并获取最具价值的方案。

1. 考虑从 i 号物品装有两种决策：装与不装。
2. 问题是：2 种决策取物品价值最高的：`pick(i, w)`。
3. 如何进行下一个子问题？
   - 装：问题变为：`pick(i + 1, w + weight[i]) + value[i]`
   - 不装：问题变为：`pick(i + 1, w)`
   - 装与不装，取最优的即可。

#### 递归（自顶向下）

```python
from functools import cache

weight = [10, 20, 30, 40, 50]
value = [50, 120, 150, 210, 240]
cap = 50

@cache
def pick(i, w):
    if (i > len(weight) - 1 or w + weight[i] > cap):
        return 0
    return max(
        pick(i + 1, w),
        pick(i + 1, w + weight[i]) + value[i]
    );

print(pick(0, 0))
```

如果有大量的物品等重，背包相等承重的决策方法就会很多，决策树里就会存在很多相同问题 `也就是i, w相等`，这也就是为什么需要加上@cache `cache会根据函数的输入参数对结果进行缓存，只要函数的输入参数相同，就会返回缓存的结果。`，别的语言则可以用 hashMap 来做缓存。

#### 循环（自底向上）

那如何改成循环呢？

不难看出上面的递归已经写出了:

1. 递推关系：`dp[i][w] = max(dp[i+1][w], dp[i+1][w + weight[i]] + value[i])`。
2. 出口条件：i > len(weight) - 1 or w + weight[i] > cap，即 `dp[i][j]=0 (i > n - 1 or j > cap)`

脑子中已经可以构建出 dp 表了：

```text
dp[n][cap + 1]:

[ 0,......] 0
.
.
.
[ 0,......] n-1
超出表范围的都是 0
```

```python
weight = [10, 20, 30, 40, 50]
value = [50, 120, 150, 210, 240]
cap = 50

n = len(weight)
dp = [[0 for _ in range(cap+1)] for _ in range(n)]
for i in range(n - 1, -1, -1):
    for w in range(cap, -1, -1):
        dp[i][w] = (
            0
            if (i + 1 > n - 1 or w + weight[i] > cap)  # 越界为0
            else max(dp[i + 1][w], dp[i + 1][w + weight[i]] + value[i])
        )
print(dp[0][0])
```

#### 空间优化

脑子想象一下 dp 表的构造过程，不难发现，当前行的结果只与下一行有关：`要么是垂直的下一个元素，要么是下一行右侧偏移weight[i]的元素，因此可以安全的改变第二个维度的迭代方向`，考虑当前位置的元素与右下方的元素关联，因此删除第一个维度后，第二个维度需要 `从左往右迭代`，这样在替换数据时，右侧的始终是可以安全使用的 `没被替换过`。

```python
weight = [10, 20, 30, 40, 50]
value = [50, 120, 150, 210, 240]
cap = 50

n = len(weight)
dp = [0 for _ in range(cap + 1)]
for i in range(n - 1, -1, -1):
    for w in range(0, cap + 1):
        dp[w] = (
            0
            if (w + weight[i] > cap)  # 越界为0
            else max(dp[w], dp[w + weight[i]] + value[i])
        )
print(dp[0])
```

🌰 有点大，不难发现，在写递归的时候从索引 0 开始考虑后，`翻译`成循环时需要倒着写迭代十分的难受，因此，在考虑递归时一般从 `索引末尾往前考虑`，这样转动态规划时就自然多了。

## 最长公共子序列问题（LCS）

温故而知新，回忆了一下背包问题再来记录下动态规划的经典问题：最长公共子序列问题。如下：

[1143.最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/description/)

> 给定两个字符串 text1 和 text2，返回这两个字符串的最长公共子序列的长度。如果不存在公共子序列 ，返回 0 。
>
> 一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
>
> 例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。
>
> 两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列。
>
> ---
>
> > 示例 1：
> > 输入：text1 = "abcde", text2 = "ace"
> > 输出：3
> > 解释：最长公共子序列是 "ace" ，它的长度为 3 。

考虑任意子序列：

1. 按照上面的经验从索引末尾往前，text1 的 i 结尾的字串与 text2 的 j 结尾的字串选或不选共有 4 种决策。

   | i\j  | 选  | 不选 |
   | ---- | --- | ---- |
   | 选   |     |      |
   | 不选 |     |      |

2. 问题是: 4 种决策中找最长的子序列：`LCS(i, j)`。
3. 怎么进行下一个子问题，即何如进行递归？

   - 如果 text1[i]=text2[j]，子问题就变成了：`max(LCS(i-1, j-1) + 1，LCS(i-1, j), LCS(i, j-1), LCS(i-1, j-1))`，对应上面 4 钟决策，易证都选的方案 `LCS(i-1, j-1) + 1`是最长的（但不一定是唯一的），因为考虑 LCS(i-1, j-1)，选 i 或 j 中的任一带来的收益最多是 LCS(i-1, j-1)+1 `因为只多了一个字母进入匹配`。
   - 如果 text1[i]!=text2[j]，子问题就变成了：`max(LCS(i-1, j), LCS(i, j-1), LCS(i-1, j-1))`，同理，LCS(i-1, j-1)也可以丢掉，因为多了一个字母进行匹配的结果总是较优的。

4. 出口条件：i<0 or j<0 `这里等于0时子串长度为1，因为0是索引`，任何一个子串为空时，肯定匹配不到任何东西，所以返回 0。

那递推关系 `最简式子`可以写出来了：
{% katex %}LCS\left(i,\;j\right)=\left\{\begin{array}{l}0,\;i<0\;or\;j<0\\LCS\left(i-1,\;j-1\right)+1\;,text1\lbrack i\rbrack=text2\lbrack j\rbrack\\max(LCS\left(i-1,\;j\right),\;LCS\left(i,\;j-1\right)),text1\lbrack i\rbrack\neq text2\lbrack j\rbrack\end{array}\right.{% endkatex %}

### LCS 递归（自顶向下）

```python
from functools import cache

text1 = "abcde"
text2 = "ace"

n = len(text1)
m = len(text2)

@cache
def LCS(i, j):
    if i < 0 or j < 0:
        return 0
    return (
        LCS(i - 1, j - 1) + 1
        if text1[i] == text2[j]
        else max(LCS(i - 1, j), LCS(i, j - 1))
    )

print(LCS(n - 1, m - 1))
```

### LCS 循环（自底向上）

一比一翻译递归写法：

1. 建立 LCS 解空间: `LCS[n][m]`。
2. 递归是用末尾到头部的自顶向下，自底向上的话从头部开始解。
3. 出口条件是 i<0 or j<0 返回 0，到循环里就是保证在取解空间里的值时不越界。

```python
text1 = "abcde"
text2 = "ace"

n = len(text1)
m = len(text2)

LCS = [[0 for _ in range(m)] for _ in range(n)]

for i in range(n):
    for j in range(m):
        LCS[i][j] = (
            (0 if i - 1 < 0 or j - 1 < 0 else LCS[i - 1][j - 1]) + 1
            if text1[i] == text2[j]
            else max(
                (0 if i - 1 < 0 else LCS[i - 1][j]), (0 if j - 1 < 0 else LCS[i][j - 1])
            )
        )

print(LCS[n - 1][m - 1])
```

这么写不难发现每次取值都要判断下越不越界，简直是脑袋裂开 🥵🥵。解决办法就是把:
解空间整体往右下移动一格，`空出最左列和最上行`。

- 这样解空间就变成 `LCS[n+1][m+1]`了。
- 循环从 `0-n`变成 `1-(n+1)`，对 `text的索引全部-1`。
- 最终解也由 `LCS[n - 1][m - 1]`变成 `LCS[n][m]`(因为右下移了一格)。
- 出口条件是 i<0 or j<0 变为 `i=0 or j=0`。那就初始解空间全为 0 即可。

```python
text1 = "abcde"
text2 = "ace"

n = len(text1)
m = len(text2)

LCS = [[0 for _ in range(m + 1)] for _ in range(n + 1)]

for i in range(1, n + 1):
    for j in range(1, m + 1):
        LCS[i][j] = (
            LCS[i - 1][j - 1] + 1
            if text1[i - 1] == text2[j - 1]
            else max(LCS[i - 1][j], LCS[i][j - 1])
        )


print(LCS[n][m])

```

### LCS 空间优化

想象一下解空间表的构造过程，不难发现，当前解 `LCS(i, j)`的结果只与 `左上的元素 or 左侧的元素 or 上面的元素`有关，因此删除第一个维度后，每次迭代需要保存 `左上的值`，因为左上的值总是被当前轮次的解替换掉。`这里就不可以改变迭代方向了，因为左侧的值是当前行的元素，与迭代方向有关`。

```python
text1 = "abcde"
text2 = "ace"

n = len(text1)
m = len(text2)

LCS = [0 for _ in range(m + 1)]

for i in range(1, n + 1):
    lt = LCS[0]
    for j in range(1, m+1):
        # 替换之前先保存一下值LCS[j]，他就是下一轮次的左上的值
        lt = LCS[j]
        LCS[j] = (
            lt + 1
            if text1[i - 1] == text2[j - 1]
            else max(LCS[j], LCS[j - 1])
        )

print(LCS[m])

```

## 最长递增子序列问题（LIS）

与 LCS 类似的是最长递增子序列问题

[300.最长递增序列](https://leetcode.cn/problems/longest-increasing-subsequence/description/)

> 给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。
>
> 子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。
>
> ---
>
> > 示例 1：
> > 输入：nums = [10,9,2,5,3,7,101,18]
> > 输出：4
> > 解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。

考虑任意子序列：

1. 从索引末尾往前，以 nums[i] 结尾的子串，对于 nums[i]只有 1 种决策`因为以nums[i]结尾`。
2. 问题是: nums 中以任意的元素结尾的`LIS(i)`取最大值。
3. 怎么进行下一个子问题，即何如进行递归？

   - 由于只有一种决策，那问题就变为：max(LIS[j]) + 1, j<i and nums[j]<nums[i]，即从前面的所有子序列中选出最长的`子序列的最后一个数字必须比nums[i]小，这样才能构成递增`，然后+1。

4. 出口条件：i=0 时`只有一个元素时，递增序列就是1`，返回 1。

那递推关系：
{% katex %}LIS(i)=max(LIS(j)+1),\;j<i\;and\;nums\lbrack j\rbrack<nums\lbrack i\rbrack{% endkatex %}

### LIS 递归（自顶向下）

```python
from functools import cache

nums = [10, 9, 2, 5, 3, 7, 101, 18]

n = len(nums)

@cache
def LIS(i):
    if i == 0:
        return 1
    max_len = 0
    for j in range(i):
        if nums[j] < nums[i]:
            max_len = max(max_len, LIS(j))
    return max_len + 1


print(max(LIS(i) for i in range(n)))

```

### LIS 循环（自底向上）

一比一翻译递归写法：

1. 建立解空间`LIS[i]`。
2. 出口条件为 i=0，即 LIS[0]=1，那就直接初始化全为 1 好了。

```python
nums = [10, 9, 2, 5, 3, 7, 101, 18]

n = len(nums)
LIS = [1 * n]

for i in range(n):
    max_len = 0
    for j in range(i):
        if nums[j] < nums[i]:
            max_len = max(max_len, LIS[j])
    LIS[i] = max_len + 1
print(max(LIS))
```

### 贪心算法

贪心算法不属于动态规划的范畴，在这里可以实现{% katex %}O(nlogn){% endkatex %}的时间复杂度。动态规划的子问题是：`求以 nums[i] 结尾的LIS长度`，贪心算法则是求`长度为i+1的LIS的末尾元素的最大值`。初始化一个空数组，循环 nums 的每个元素，不断的贪心更新空数组。

这里留下一篇写的比较好的文章：[最长递增子序列（nlogn 二分法、DAG 模型 和 延伸问题）](https://writings.sh/post/longest-increasing-subsequence-revisited#footnote-3)
