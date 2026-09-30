# 📐 Form Best Practices Visual Guide

**Quick Reference for TRADIE Form Development**

---

## ✅ **DO THIS** - Stable Pattern

### **Pattern 1: Component Outside Parent**

```typescript
// ✅ CORRECT - Component defined OUTSIDE parent
import React, { useState, useCallback, memo } from 'react';

const VoiceInput = memo(({ 
  value, 
  onChange, 
  label, 
  placeholder 
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg focus:border-[#F4D03F] focus:outline-none"
      />
    </div>
  );
});

VoiceInput.displayName = "VoiceInput";

// Parent component
export default function MyForm() {
  const [name, setName] = useState("");
  
  return (
    <VoiceInput 
      value={name} 
      onChange={setName}
      label="Name"
      placeholder="Enter name"
    />
  );
}
```

**Why this works:**
- ✅ Component is created once, not on every render
- ✅ Input maintains focus during typing
- ✅ No re-mounting
- ✅ Stable component reference

---

## ❌ **DON'T DO THIS** - Unstable Pattern

### **Anti-Pattern 1: Component Inside Parent**

```typescript
// ❌ WRONG - Component defined INSIDE parent
import React, { useState } from 'react';

export default function MyForm() {
  const [name, setName] = useState("");
  
  // ❌ This component is recreated on EVERY render!
  const VoiceInput = ({ value, onChange }: any) => {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
  
  // ❌ This will cause focus loss after each keystroke
  return <VoiceInput value={name} onChange={setName} />;
}
```

**Why this fails:**
- ❌ Component recreated on every state change
- ❌ Input unmounts and remounts
- ❌ Focus lost after each keystroke
- ❌ User must click again to continue typing

---

## 🎯 **Pattern Comparison**

### **Input Behavior:**

```
STABLE PATTERN (✅):
User types: "H" → "He" → "Hel" → "Hell" → "Hello"
Focus: Maintained throughout
Clicks needed: 1

UNSTABLE PATTERN (❌):
User types: "H"
Focus: LOST
User clicks again
User types: "e"
Focus: LOST
User clicks again
...and so on
Clicks needed: 5+ (frustrating!)
```

---

## 📋 **Component Patterns**

### **1. Simple Input**

```typescript
// ✅ STABLE - Direct ShadCN UI
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function MyForm() {
  const [value, setValue] = useState("");

  return (
    <div>
      <Label>Name</Label>
      <Input 
        value={value} 
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
```

---

### **2. Dropdown/Select**

```typescript
// ✅ STABLE - ShadCN Select
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function MyForm() {
  const [selected, setSelected] = useState("");

  return (
    <Select value={selected} onValueChange={setSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

---

### **3. Multi-Select Dropdown**

```typescript
// ✅ STABLE - Custom component OUTSIDE parent
const MultiSelect = memo(({ 
  options, 
  selected, 
  onChange 
}: {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);

  const handleToggle = useCallback((option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  }, [selected, onChange]);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>
        {selected.length} selected
      </button>
      {open && (
        <div>
          {options.map(opt => (
            <div key={opt} onClick={() => handleToggle(opt)}>
              {selected.includes(opt) && "✓"} {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

MultiSelect.displayName = "MultiSelect";
```

---

### **4. OTP Input**

```typescript
// ✅ STABLE - Component OUTSIDE parent
const OTPInput = memo(({ 
  value, 
  onChange 
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const handleChange = useCallback((idx: number, newValue: string) => {
    const valueArray = value.split("");
    valueArray[idx] = newValue;
    onChange(valueArray.join(""));
    
    // Auto-focus next
    if (newValue && idx < 5) {
      const nextInput = document.querySelectorAll('input[type="text"]')[idx + 1] as HTMLInputElement;
      nextInput?.focus();
    }
  }, [value, onChange]);

  return (
    <div className="flex gap-2">
      {[0, 1, 2, 3, 4, 5].map(idx => (
        <input
          key={idx}
          type="text"
          maxLength={1}
          value={value[idx] || ""}
          onChange={(e) => handleChange(idx, e.target.value)}
          className="w-12 h-14 text-center text-2xl border-2 rounded-lg"
        />
      ))}
    </div>
  );
});

OTPInput.displayName = "OTPInput";
```

---

## 🎨 **Visual Feedback**

### **Focus States**

```typescript
// ✅ Clear focus indicators
const inputStyles = `
  border-2 border-gray-300          // Default
  focus:border-[#F4D03F]            // Gold when focused
  focus:outline-none                // Remove default outline
  focus:ring-2                      // Add ring
  focus:ring-[#F4D03F]/20          // Gold ring with opacity
  transition-all                    // Smooth transition
  duration-200
`;

<input className={inputStyles} />
```

**Visual States:**
```
Default:  ┌─────────────┐
          │             │  Gray border (border-gray-300)
          └─────────────┘

Focused:  ┏━━━━━━━━━━━━━┓
          ┃ Typing...   ┃  Gold border + ring (border-[#F4D03F])
          ┗━━━━━━━━━━━━━┛
            ⌇⌇⌇⌇⌇⌇⌇⌇⌇      Gold glow (ring-[#F4D03F]/20)

Error:    ┌─────────────┐
          │ Invalid!    │  Red border (border-red-500)
          └─────────────┘
          ⚠️ Error message
```

---

### **Loading States**

```typescript
// ✅ Clear loading feedback
<Button disabled={loading}>
  {loading ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin mr-2" />
      Processing...
    </>
  ) : (
    "Submit"
  )}
</Button>
```

**Visual Flow:**
```
Ready:      [ Submit ]          // Clickable, blue

Loading:    [ ⟳ Processing... ] // Disabled, spinner

Success:    [ ✓ Success! ]      // Green, checkmark

Error:      [ ⚠ Try Again ]     // Red, warning
```

---

## 🔍 **Dropdown Best Practices**

### **Single Select**

```typescript
// ✅ Closes after selection
const handleSelect = useCallback((value: string) => {
  onSelect(value);
  setOpen(false);  // Close dropdown
}, [onSelect]);
```

### **Multi-Select**

```typescript
// ✅ Stays open for multiple selections
const handleSelect = useCallback((value: string) => {
  if (selected.includes(value)) {
    onSelect(selected.filter(v => v !== value));
  } else {
    onSelect([...selected, value]);
  }
  // Don't close - allow multiple selections
}, [selected, onSelect]);
```

### **Search Filter**

```typescript
// ✅ Debounced search
const [search, setSearch] = useState("");

const filtered = useMemo(() => {
  return options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );
}, [options, search]);

// Debounce for better performance
const debouncedSearch = useMemo(
  () => debounce(setSearch, 300),
  []
);
```

---

## 🎯 **Form Validation**

### **Inline Validation**

```typescript
// ✅ Real-time validation feedback
const [email, setEmail] = useState("");
const [error, setError] = useState("");

const validateEmail = useCallback((value: string) => {
  if (!value.includes("@")) {
    setError("Invalid email format");
  } else {
    setError("");
  }
}, []);

return (
  <div>
    <Input 
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
      }}
      className={error ? "border-red-500" : ""}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">
        {error}
      </p>
    )}
  </div>
);
```

---

## 📱 **Responsive Design**

### **Mobile-First Approach**

```typescript
// ✅ Responsive inputs
<input className="
  w-full                    // Full width
  h-12                      // Height 48px
  px-4                      // Padding 16px
  text-base                 // 16px font (no zoom on iOS)
  rounded-lg                // Rounded corners
  sm:w-auto                 // Auto width on small screens
  md:max-w-md              // Max width on medium screens
" />
```

---

## ⚡ **Performance Tips**

### **1. Memoization**

```typescript
// ✅ Memoize components
const MyInput = memo(({ value, onChange }) => {
  return <input value={value} onChange={onChange} />;
});

// ✅ Memoize callbacks
const handleChange = useCallback((e) => {
  onChange(e.target.value);
}, [onChange]);

// ✅ Memoize computed values
const filtered = useMemo(() => {
  return data.filter(item => item.includes(search));
}, [data, search]);
```

### **2. Debouncing**

```typescript
// ✅ Debounce expensive operations
import { debounce } from 'lodash';

const debouncedSearch = useMemo(
  () => debounce((value: string) => {
    performSearch(value);
  }, 300),
  []
);
```

### **3. Virtualization**

```typescript
// ✅ For long lists, use virtualization
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
});
```

---

## 🧪 **Testing Checklist**

### **Manual Testing:**

```
Input Fields:
☑ Single keystroke doesn't lose focus
☑ Can type continuously without re-clicking
☑ Cursor position maintained
☑ Paste functionality works
☑ Backspace/delete smooth

Dropdowns:
☑ Opens on single click
☑ Closes after selection (single-select)
☑ Stays open for multi-select
☑ Search filter works
☑ Keyboard navigation works

Forms:
☑ Tab order logical
☑ Enter key submits
☑ Escape cancels/closes
☑ Validation inline
☑ Error messages clear
```

---

## 📚 **ShadCN UI Components**

### **Use These Stable Components:**

```typescript
// ✅ All ShadCN components are stable by design
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { RadioGroup } from './ui/radio-group';
import { Calendar } from './ui/calendar';
import { Dialog } from './ui/dialog';
```

**Benefits:**
- ✅ Pre-optimized for stability
- ✅ Accessible by default
- ✅ Consistent styling
- ✅ TypeScript support
- ✅ No custom implementation needed

---

## 🎓 **Quick Reference Card**

```
╔═══════════════════════════════════════════════════════════╗
║                  FORM STABILITY RULES                     ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  1. ✅ Components OUTSIDE parent function                 ║
║  2. ✅ Use React.memo for components                      ║
║  3. ✅ Use useCallback for handlers                       ║
║  4. ✅ Use useMemo for computed values                    ║
║  5. ✅ Add displayName to components                      ║
║  6. ✅ Use ShadCN UI when possible                        ║
║  7. ✅ Clear focus indicators                             ║
║  8. ✅ Inline validation                                  ║
║  9. ✅ Loading states                                     ║
║  10. ✅ Error feedback                                    ║
║                                                           ║
║  ❌ DON'T define components inside parent                ║
║  ❌ DON'T create new component instances in render       ║
║  ❌ DON'T nest too many components                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 🔗 **Related Documentation**

- FORM_STABILITY_COMPREHENSIVE_REVIEW.md - Full audit
- INPUT_FOCUS_FIX_COMPLETE.md - Original fix
- ENHANCED_BUTTON_AESTHETICS_SUMMARY.md - UI aesthetics

---

*Visual Guide Version: 1.0*  
*Last Updated: October 29, 2025*  
*For: TRADIE v1 Form Development*
