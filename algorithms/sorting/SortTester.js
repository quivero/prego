import {
  arr,
  sorted_arr,
  reverse_arr,
  ones_arr,
  other_arr,
  sorted_other_arr,
  negative_arr,
  sorted_negative_arr,
} from './fixtures';

let sorter, callbacks;

let trivia, result, expected;

export class SortTester {
  static testSort(SortingClass) {
    sorter = new SortingClass();

    trivia = [
      [sorter.sort([]), []],
      [sorter.sort([1]), [1]],
      [sorter.sort([1, 2]), [1, 2]],
      [sorter.sort([2, 1]), [1, 2]],
      [sorter.sort(other_arr), sorted_other_arr],
      [sorter.sort(arr), sorted_arr],
      [sorter.sort(reverse_arr), sorted_arr],
      [sorter.sort(ones_arr), ones_arr],
    ];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toEqual(expected);
    }
  }

  static testNegativeNumbersSort(SortingClass) {
    sorter = new SortingClass();

    result = sorter.sort(negative_arr);
    expected = sorted_negative_arr;

    expect(result).toEqual(expected);
  }

  static testSortWithCustomComparator(SortingClass) {
    callbacks = {
      compareCallback: (a, b) => {
        if (a.length === b.length) {
          return 0;
        }
        return a.length < b.length ? -1 : 1;
      },
    };

    sorter = new SortingClass(callbacks);

    trivia = [
      [sorter.sort(['']), ['']],
      [sorter.sort(['a']), ['a']],
      [sorter.sort(['aa', 'a']), ['a', 'aa']],
      [sorter.sort(['aa', 'q', 'bbbb', 'ccc']), ['q', 'aa', 'ccc', 'bbbb']],
      [sorter.sort(['aa', 'aa']), ['aa', 'aa']],
    ];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toEqual(expected);
    }
  }

  static testSortStability(SortingClass) {
    callbacks = {
      compareCallback: (a, b) => {
        if (a.length === b.length) {
          return 0;
        }

        return a.length < b.length ? -1 : 1;
      },
    };

    sorter = new SortingClass(callbacks);

    trivia = [
      [sorter.sort(['bb', 'aa', 'c']), ['c', 'bb', 'aa']],
      [
        sorter.sort(['aa', 'q', 'a', 'bbbb', 'ccc']),
        ['q', 'a', 'aa', 'ccc', 'bbbb'],
      ],
    ];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toEqual(expected);
    }
  }

  static testAlgorithmTimeComplexity(
    SortingClass,
    arrayToBeSorted,
    numberOfVisits
  ) {
    const visitingCallback = jest.fn();
    callbacks = { visitingCallback };
    sorter = new SortingClass(callbacks);

    sorter.sort(arrayToBeSorted);

    result = visitingCallback;
    expected = numberOfVisits;

    expect(result).toHaveBeenCalledTimes(expected);
  }
}
