// ============================================================
// CategoryChips — Filter Buttons for Attractions
// ============================================================
//
// 📚 REACT CONCEPT: Controlled component + Lifting State Up
//
// This component is "controlled" — it does NOT own the active category state.
// The parent page owns the state and passes it down as:
//   • activeCategory (what is currently selected)
//   • onSelect (callback to update the parent's state when a chip is clicked)
//
// This pattern is called "lifting state up" because:
//   - The attraction grid (sibling component) also needs activeCategory
//     to filter its results
//   - If chips owned the state, the grid couldn't see it
//   - By lifting state to the parent page, BOTH components can share it
//
// Parent (HomePage):
//   const [activeCategory, setActiveCategory] = useState('all');
//   <CategoryChips activeCategory={activeCategory} onSelect={setActiveCategory} />
//   <AttractionGrid filter={activeCategory} />
// ============================================================

/**
 * @param {Array}    categories     - Array of { id, name, icon } from Firestore
 * @param {string}   activeCategory - Currently selected category id
 * @param {function} onSelect       - Called with new category id when chip is clicked
 */
export function CategoryChips({ categories, activeCategory, onSelect }) {
  return (
    <section className="categories-section">
      <div className="container">
        <div
          className="categories-scroll"
          id="category-chips"
          role="group"
          aria-label="Filter by category"
        >
          {/* 📚 Array.map() renders a list of components from an array.
              The key prop must be unique within the list — React uses it
              to efficiently update only the changed items. */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-chip ${cat.id === activeCategory ? 'active' : ''}`}
              data-cat={cat.id}
              onClick={() => onSelect(cat.id)}
              aria-pressed={cat.id === activeCategory}
            >
              <span className="cat-icon">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
