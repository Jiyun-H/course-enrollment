// src/components/steps/step1/CategoryFilter.tsx
"use client";

import { categoryLabels } from "@/mocks/courses";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  getCategoryCount: (category: string) => number;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  getCategoryCount,
}: CategoryFilterProps) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        카테고리
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("")}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              selectedCategory === ""
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          전체 ({getCategoryCount("")})
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {categoryLabels[category] || category} ({getCategoryCount(category)}
            )
          </button>
        ))}
      </div>
    </div>
  );
}
