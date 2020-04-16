# Terra Toolkit Upgrade Guide v6.0.0
This document will provide information on upgrading from terra-toolkit 5.x to 6.0.0.

### AxeService
The `axe-core` dependency was updated from `3.2.0` to `3.5.3`. The version bump is required to fix an axe-core error that occurs in IE when inspecting a page containing an SVG element (i.e. terra-icon). See [this issue](https://github.com/cerner/terra-toolkit/issues/318) for more detail.

Many bugs were fixed, new accessibility rules were added, and existing rules were fine-tuned in version `3.5.3`. All the changes between versions `3.2.0` and `3.5.3` can be found [here](https://github.com/dequelabs/axe-core/releases). Some of these changes are non-passive, hence the major version bump in terra-toolkit. If accessibility errors occur in webdriverio tests, follow the descriptive error messages to correct the failures. The error description shows useful information including the `description` and `id` of the error, a `helpUrl` with additional information about the error, a `failureSummary` with suggestion to fix the error, and most importantly the `html` element that causes the error. Below are the common accessibility errors encountered in Terra components.

- `aria-input-field-name`: Ensure that the reported html element has the `aria-label` or `aria-labelledby` attribute.
- `aria-required-children`: Ensure elements including explicit or implicit ARIA roles include required children elements. For example, if the `role` of the parent element is `listbox`, its children elements must have a `role` of `option`.
- `color-contrast`: If the `opacity` css style is applied to an element to give it a `disabled` appearance and causes insufficient color-contrast with the background color, ensure that the `aria-disabled` attribute is added to this element.


The following are rule `ids` of the new rules introduced between versions `3.2.0` to `3.5.3`.
- [aria-input-field-name](https://dequeuniversity.com/rules/axe/3.5/aria-input-field-name)
- [aria-roledescription](https://dequeuniversity.com/rules/axe/3.5/aria-roledescription)
- [aria-toggle-field-name](https://dequeuniversity.com/rules/axe/3.5/aria-toggle-field-name)
- [avoid-inline-spacing](https://dequeuniversity.com/rules/axe/3.5/avoid-inline-spacing)
- [input-button-name](https://dequeuniversity.com/rules/axe/3.5/input-button-name)
- [landmark-unique](https://dequeuniversity.com/rules/axe/3.5/landmark-unique)
- [role-img-alt](https://dequeuniversity.com/rules/axe/3.5/role-img-alt)
- [scrollable-region-focusable](https://dequeuniversity.com/rules/axe/3.5/scrollable-region-focusable) - This new rule is temporarily disabled by terra-toolkit because it causes failures in many Terra components and the solution to address this failure vary by component. This rule will be enabled in the future once a strategic solution is identified.
