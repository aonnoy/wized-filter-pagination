# Wized Filter and Pagination

A no-code solution that seamlessly integrates filtering and pagination into your Webflow, Wized, and Xano projects. By simply adding attributes to your Webflow filters and configuring requests and elements in Wized, you can set up a fully functional system in minutes—saving you hours of development time.

⚠️ **Note:**
- This solution is **designed exclusively for Xano** as the backend.

## 🚀 Quick Links

- [📺 Checkout the Demo](https://www.notion.so/Wized-Filters-and-Pagination-19e18ed965d88089afa2fe9c749eb857?pvs=21)
- [🎥 Watch the YouTube Tutorial](https://www.notion.so/Wized-Filters-and-Pagination-19e18ed965d88089afa2fe9c749eb857?pvs=21)
- [🌐 Get the Webflow Cloneable](https://www.notion.so/Wized-Filters-and-Pagination-19e18ed965d88089afa2fe9c749eb857?pvs=21)
- [📦 View the NPM Package](https://www.notion.so/Wized-Filters-and-Pagination-19e18ed965d88089afa2fe9c749eb857?pvs=21)
- [☕ Buy Me a Coffee](https://www.notion.so/Wized-Filters-and-Pagination-19e18ed965d88089afa2fe9c749eb857?pvs=21)
- [Create an Account on Wized (Affiliate Link)](http://www.google.com)
- [Create an Account On Xano (Affiliate Link)](https://www.notion.so/44aa13088fd244a2aa43a12bad7bf205?pvs=21)

## Supported Filter Types

- **Checkbox** – Allow users to select multiple options.
- **Radio Select** – Enable single-option selection.
- **Select** – Dropdown-based selection.
- **Select Range** – Filter by range.
- **Sort** – Arrange results based on predefined criteria.
- **Infinite Pagination** – Seamless content loading as users scroll.
- **Search** – Keyword-based filtering.
- **Chips** – Visual filter tags for quick selection.
- **Reset All Filters** – Clear all active filters at once.
- **Reset Individual Filters** – Remove specific filters without affecting others.

## Features

- **Custom Filter Triggers** – Define how and when filters are applied.
- **Flexible Styling Options** – Easily customise the look and feel to match your design.
- **Configurable Behaviours** – Adjust filter logic to suit different use cases.
- **Event-Based Architecture** – Filters and pagination respond dynamically to user actions.
- **Optimised Performance** – Efficient updates with minimal page reloads.
- **Debounced Filter Updates** – Prevent unnecessary requests for a smoother experience.
- **State Management Built-in** – Filters stay in sync without extra setup.
- **Seamless Infinite Scroll** – Load more content automatically as users scroll.

## Get Started

To use **Wized Filter and Pagination**, include the CDN link in the `<head>` tag of your page:

```html
<!-- WIZED FILTER AND PAGINATION BY AONNOY-->
<script async type="module" src="https://cdn.jsdelivr.net/npm/wized-filter-and-pagination@1.0.15/dist/index.min.js"></script>
```

## Setup

### Add Attribute to the Form Element that contains the filters

| **ATTRIBUTE** | **VALUE** | **REQUIRED** | **DESCRIPTION** |
|---------------|-----------|--------------|-----------------|
| `w-filter-wrapper` | (No value needed) | ✅ | The Webflow form element that wraps all filters, pagination, and items to be filtered. |

## Create Infinite Pagination and its attributes list

This feature enables infinite scrolling, where more content loads dynamically as the user scrolls.
To implement infinite pagination correctly, follow these key setup steps:

### 🚨 Important Setup Requirements

1. **Create Two Wized Requests:**
   - You need **two Wized requests** responsible for fetching and rendering paginated content:
     - **First Request:** Executes on page load, fetches initial data, and stores it in a **Wized variable**. Your filter content should be rendered from this variable.
     - **Second Request (Clone of the First):** This request is triggered **by the pagination element**. When it finishes, the script will append the newly fetched data to the existing Wized variable, ensuring smooth content loading.

2. **Create Two Wized Variables for Pagination Control:**
   - **Current Page Variable:** Stores the number of the current page.
   - **Next Page Variable:** Stores the number of the next page.
   - **Both variables must be updated** whenever either of the two Wized requests is executed.

3. **Pagination Stops Automatically:**
   - The pagination will **stop functioning** when the Wized variable holding the **next page number** becomes `null`, indicating that there are no more pages to fetch.

| **ATTRIBUTE** | **VALUE** | **REQUIRED** | **DESCRIPTION** |
|---------------|-----------|--------------|-----------------|
| `w-filter-pagination-trigger` | *(No value needed)* | ✅ | Identifies this element as the **infinite pagination trigger**. The script detects this to load more content. |
| `w-filter-pagination-request` | *Wized Request Name* | ✅ | The name of the Wized request that initializes pagination. Pagination only begins **after this request successfully executes**. |
| `w-filter-pagination-current-variable` | *Wized Variable Name* | ✅ | Tracks the **current page number** stored in the specified Wized variable. This variable must be updated with each request execution. |
| `w-filter-pagination-next-variable` | *Wized Variable Name* | ✅ | Checks the **next page number** stored in the specified Wized variable. **Pagination stops when this value is `null`**. |
| `w-filter-request` | *Wized Request Name* | ✅ | The request that fetches the **next batch of items** when pagination is triggered. |
| `w-filter-result-variable` | *Wized Variable Name* | ✅ | The variable that stores the **entire dataset** being filtered and paginated. This variable gets updated as new data is fetched. |
| `w-filter-result-data-path` | *Wized Request Data Path* | ✅ | Specifies the **data path** where the new batch of content is located. The script retrieves this data and appends it to the `w-filter-result-variable`. |

## Create Checkbox Filter and its attributes list

- This filter is ideal for allowing users to select multiple options within a category.
- You can create multiple checkbox filters as needed. Ensure that attributes with unique values are distinct to prevent conflicts.
- Attributes should be applied to the **checkbox wrapper**.
- Checkboxes can be **static** or **dynamically generated**. Follow the attribute table below for setup details.

| **ATTRIBUTE** | **VALUE** | **REQUIRED** | **DESCRIPTION** |
|---------------|-----------|--------------|-----------------|
| `wized` | *WIZED IDENTIFIER* | ✅ | Standard Wized identifier for this element. |
| `w-filter-checkbox-variable` | *WIZED VARIABLE NAME* | ✅ | Stores the selected checkbox **label values** inside the specified Wized variable as an array of strings. |
| `w-filter-checkbox-request` | *WIZED REQUEST NAME* | ⬜ Optional | Used **only** if checkboxes are dynamically loaded. The value should be the name of the Wized request fetching the checkbox options. **Not required for static checkboxes.** |
| `w-filter-checkbox-category` | *UNIQUE IDENTIFIER* | ✅ | Groups checkboxes together. Essential for **Chips Filters** and for targeting specific checkbox groups when using the reset feature. |
| `w-filter-pagination-current-variable` | *WIZED VARIABLE NAME* | ✅ | Ensures pagination resets to **page 1** when a checkbox is selected/deselected. Must match the correct Wized variable for pagination. |
| `w-filter-request` | *WIZED REQUEST NAME* | ✅ | Fires a Wized request to reload filtered content whenever a checkbox is toggled. |

## Create Radio Select Filter and its attributes list

- This filter is ideal for allowing users to select only one option from a predefined set.
- You can create multiple radio selects as needed. Ensure that attributes with unique values are distinct to prevent conflicts.
- Attributes should be applied to the **radio select wrapper**.
- Radio Selects can be **static** or **dynamically generated**. Follow the attribute table below for setup details.

| **ATTRIBUTE** | **VALUE** | **REQUIRED** | **DESCRIPTION** |
|---------------|-----------|--------------|-----------------|
| `wized` | *WIZED IDENTIFIER* | ✅ | Standard Wized identifier for this element. |
| `w-filter-radio-variable` | *WIZED VARIABLE NAME* | ✅ | Stores the selected radio **label value** inside the specified Wized variable as a string |
| `w-filter-radio-request` | *WIZED REQUEST NAME* | ⬜ Optional | Used **only** if radios are dynamically loaded. The value should be the name of the Wized request fetching the radio select options. **Not required for static radio selects.** |
| `w-filter-radio-category` | *UNIQUE IDENTIFIER* | ✅ | Groups radios together. Essential for **Chips Filters** and for targeting specific radio groups when using the reset feature. |
| `w-filter-pagination-current-variable` | *WIZED VARIABLE NAME* | ✅ | Ensures pagination resets to **page 1** when a radio is selected/deselected. Must match the correct Wized variable for pagination. |
| `w-filter-request` | *WIZED REQUEST NAME* | ✅ | Fires a Wized request to reload filtered content whenever a radio is selected or reset |

## Create Select Filter and its attributes list

- This filter is ideal for providing users with a dropdown menu to select a single option from a list.
- You can create multiple select filters as needed. Ensure that attribute values are unique to prevent conflicts.
- Attributes should be applied **directly** to the `<select>` element.
- The select filter can be **static** or **dynamically loaded**. Follow the attribute table below for setup details.

| **ATTRIBUTE** | **VALUE** | **REQUIRED** | **DESCRIPTION** |
|---------------|-----------|--------------|-----------------|
| `wized` | *WIZED IDENTIFIER* | ✅ | Standard Wized identifier for this element. |
| `w-filter-select-variable` | *WIZED VARIABLE NAME* | ✅ | Stores the selected select filter **value** inside the specified Wized variable as a string |
| `w-filter-select-request` | *WIZED REQUEST NAME* | ⬜ Optional | Used **only** if the select filter is dynamically loaded. The value should be the name of the Wized request fetching the select filter options. **Not required for static select filter.** |
| `w-filter-select-category` | *UNIQUE IDENTIFIER* | ✅ | Groups select filters together. Essential for **Chips Filters** and for targeting specific select filter groups when using the reset feature. |
| `w-filter-pagination-current-variable` | *WIZED VARIABLE NAME* | ✅ | Ensures pagination resets to **page 1** when a select filter is selected/deselected. Must match the correct Wized variable for pagination. |
| `w-filter-request` | *WIZED REQUEST NAME* | ✅ | Fires a Wized request to reload filtered content whenever a select filter is selected or reset |

### If your select filter needs to dynamically load options, follow these additional steps:

1. Add the attributes mentioned above to your select filter.
2. Apply a **combo class** to hide the select filter (as it will be populated dynamically).
3. Create a **div block** containing two **text elements** inside it.
4. Apply the following attributes to the **div block**:
5. You will need to ensure that this div block is placed close to the select filter especially if they share the same w-filter-select-category value

| **ATTRIBUTE** | **VALUE** | **REQUIRED** | **DESCRIPTION** |
|---------------|-----------|--------------|-----------------|
| `w-filter-select-category` | *NEEDS TO HAVE THE SAME VALUE AS THE SELECT FILTER THAT THIS DIV BLOCK BELONGS TO* | ✅ | Ensures this div block is linked to the correct select filter. |
| `w-filter-select-option` | wrapper | ✅ | Identifies the div block as the wrapper for dynamic options. |

One of the text elements in the div block will need to have the following attributes:

| **ATTRIBUTE** | **VALUE** | **REQUIRED** | **DESCRIPTION** |
|---------------|-----------|--------------|-----------------|
| `wized` | *WIZED IDENTIFIER* | ✅ | Used to render the option text. |
| `w-filter-select-option` | option-text | ✅ | Defines the text that will be displayed as the **option label** in the select dropdown. |

The other text element in the div block will need to have the following attributes:

| **ATTRIBUTE** | **VALUE** | **REQUIRED** | **DESCRIPTION** |
|---------------|-----------|--------------|-----------------|
| `wized` | *WIZED IDENTIFIER* | ✅ | Used to render the option value. |
| `w-filter-select-option` | value-text | ✅ | Defines the actual **value** that will be stored in the Wized variable when selected. |

## Create Select Range Filter and its attributes list

- This filter allows users to select a range using two dropdowns (e.g., a "FROM" and "TO" value).
- You can create multiple select range filters as needed. Ensure that each filter has unique attribute values to prevent conflicts.
- Attributes must be applied **directly** to each `<select>` element.
- The select range filter can be **static** or **dynamically loaded**.
- The setup is similar to the standard **Select Filter**, but with separate attributes for "FROM" and "TO" dropdowns.

### Attributes for "FROM" Select Range

| **ATTRIBUTE** | **VALUE** | **REQUIRED** | **DESCRIPTION** |
|---------------|-----------|--------------|-----------------|
| `wized` | *Wized Identifier* | ✅ | Standard Wized identifier for this element. |
| `w-filter-select-range-from-variable` | *Wized Variable Name* | ✅ | Stores the selected **FROM value** inside the specified Wized variable as a string. |
| `w-filter-select-range-category` | *Unique Identifier* | ✅ | Groups select range filters together. Essential for **Chips Filters** and for targeting specific filter groups when using the reset feature. |
| `w-filter-request` | *Wized Request Name* | ✅ | Fires a Wized request to reload filtered content whenever a selection is made or reset. |
| `w-filter-select-range-request` | *Wized Request Name* | ⬜ Optional | Used **only** if the select filter options are dynamically loaded. Set this value to the Wized request fetching the options. **Not required for static filters.** |
| `w-filter-pagination-current-variable` | *Wized Variable Name* | ✅ | Ensures pagination resets to **page 1** when a selection is made. Must match the correct Wized variable for pagination. |

### Attributes for "TO" Select Range

| **ATTRIBUTE** | **VALUE** | **REQUIRED** | **DESCRIPTION** |
|---------------|-----------|--------------|-----------------|
| `wized` | *
