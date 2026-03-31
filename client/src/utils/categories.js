export const EXPENSE_CATEGORIES = [
  { value: 'Food',          label: 'Food'          },
  { value: 'Transport',     label: 'Transport'     },
  { value: 'Shopping',      label: 'Shopping'      },
  { value: 'Bills',         label: 'Bills'         },
  { value: 'Health',        label: 'Health'        },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Education',     label: 'Education'     },
  { value: 'Other',         label: 'Other'         },
];

export const INCOME_CATEGORIES = [
  { value: 'Salary',     label: 'Salary'     },
  { value: 'Freelance',  label: 'Freelance'  },
  { value: 'Gift',       label: 'Gift'       },
  { value: 'Business',   label: 'Business'   },
  { value: 'Investment', label: 'Investment' },
  { value: 'Other',      label: 'Other'      },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const getCategoriesForType = (type) => {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
};

export const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️', Bills: '📄',
  Health: '💊', Entertainment: '🎮', Education: '📚', Salary: '💼',
  Freelance: '💻', Gift: '🎁', Business: '🏢', Investment: '📈', Other: '📌',
};

export const CATEGORY_COLORS = {
  Food:          '#ef4444',
  Transport:     '#f97316',
  Shopping:      '#eab308',
  Bills:         '#84cc16',
  Health:        '#22c55e',
  Entertainment: '#06b6d4',
  Education:     '#6366f1',
  Salary:        '#5b8ef7',
  Freelance:     '#7c3aed',
  Gift:          '#ec4899',
  Business:      '#0f766e',
  Investment:    '#34d399',
  Other:         '#7a90b8',
};
