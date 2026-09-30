# 🔧 Quick Fix Guide: Input Losing Focus

## 🚨 **Symptoms**
- Input field loses focus after typing ONE character
- Need to click input again to continue typing
- Cursor disappears after each keystroke

---

## ✅ **Instant Fix Checklist**

### **1. Check Component Definition Location**

```typescript
// ❌ WRONG - Component defined INSIDE parent
function ParentComponent() {
  const [value, setValue] = useState("");
  
  // This is the problem! ↓
  const MyInput = ({ val, onChange }) => (
    <input value={val} onChange={onChange} />
  );
  
  return <MyInput val={value} onChange={setValue} />;
}

// ✅ CORRECT - Component defined OUTSIDE parent
const MyInput = React.memo(({ val, onChange }) => {
  const handleChange = React.useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);
  
  return <input value={val} onChange={handleChange} />;
});

MyInput.displayName = "MyInput";

function ParentComponent() {
  const [value, setValue] = useState("");
  return <MyInput val={value} onChange={setValue} />;
}
```

---

### **2. Use React.memo for Stability**

```typescript
// Wrap component with React.memo
const MyComponent = React.memo(({ value, onChange }) => {
  return <input value={value} onChange={onChange} />;
});

// Add displayName for debugging
MyComponent.displayName = "MyComponent";
```

---

### **3. Use useCallback for Event Handlers**

```typescript
const MyInput = React.memo(({ value, onChange }) => {
  // Memoize the handler
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);
  
  return (
    <input 
      value={value} 
      onChange={handleChange}  // Use memoized handler
    />
  );
});
```

---

### **4. Prevent Button Events from Affecting Inputs**

```typescript
// For buttons near inputs (like voice mic)
const handleButtonClick = React.useCallback((e: React.MouseEvent) => {
  e.preventDefault();  // Prevent form submission
  e.stopPropagation(); // Stop event bubbling
  // Your logic here
}, []);

<button 
  type="button"  // Prevent form submission
  onClick={handleButtonClick}
>
  Click Me
</button>
```

---

## 🎯 **Common Scenarios & Fixes**

### **Scenario 1: Voice Input with Mic Button**

```typescript
// ✅ CORRECT
const VoiceInput = React.memo(({ label, value, onChange }) => {
  const [listening, setListening] = useState(false);
  
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);
  
  const handleMicClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setListening(prev => !prev);
  }, []);
  
  return (
    <div>
      {label && <label>{label}</label>}
      <input value={value} onChange={handleChange} />
      <button type="button" onClick={handleMicClick}>
        🎤
      </button>
    </div>
  );
});

VoiceInput.displayName = "VoiceInput";
```

---

### **Scenario 2: Searchable Dropdown**

```typescript
// ✅ CORRECT
const SearchableDropdown = React.memo(({ options, onSelect }) => {
  const [search, setSearch] = useState("");
  
  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);
  
  const filtered = React.useMemo(() => 
    options.filter(opt => opt.name.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );
  
  return (
    <div>
      <input 
        value={search} 
        onChange={handleSearchChange}
        placeholder="Search..."
      />
      <ul>
        {filtered.map(opt => (
          <li key={opt.id} onClick={() => onSelect(opt)}>
            {opt.name}
          </li>
        ))}
      </ul>
    </div>
  );
});

SearchableDropdown.displayName = "SearchableDropdown";
```

---

### **Scenario 3: OTP Input with Auto-Focus**

```typescript
// ✅ CORRECT
const OTPInput = React.memo(({ value, onChange }) => {
  const handleChange = React.useCallback((idx: number, newValue: string) => {
    const arr = value.split("");
    arr[idx] = newValue;
    onChange(arr.join(""));
    
    // Auto-focus next input
    if (newValue && idx < 5) {
      const nextInput = document.querySelectorAll('input[type="text"]')[idx + 1] as HTMLInputElement;
      nextInput?.focus();
    }
  }, [value, onChange]);
  
  return (
    <div className="flex gap-2">
      {[0, 1, 2, 3, 4, 5].map(idx => (
        <input
          key={`otp-${idx}`}  // Stable key
          type="text"
          maxLength={1}
          value={value[idx] || ""}
          onChange={(e) => handleChange(idx, e.target.value)}
        />
      ))}
    </div>
  );
});

OTPInput.displayName = "OTPInput";
```

---

### **Scenario 4: Form with Multiple Inputs**

```typescript
// ✅ CORRECT
const FormInput = React.memo(({ label, value, onChange, ...props }) => {
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);
  
  return (
    <div>
      <label>{label}</label>
      <input value={value} onChange={handleChange} {...props} />
    </div>
  );
});

FormInput.displayName = "FormInput";

// Usage
function MyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  return (
    <form>
      <FormInput label="Name" value={name} onChange={setName} />
      <FormInput label="Email" value={email} onChange={setEmail} type="email" />
    </form>
  );
}
```

---

## 🔍 **Debugging Steps**

### **Step 1: Identify the Problem Component**
```typescript
// Add console.log to see if component is recreating
const MyInput = ({ value, onChange }) => {
  console.log("MyInput rendering"); // If you see this on every keystroke, it's recreating
  return <input value={value} onChange={onChange} />;
};
```

### **Step 2: Check Where Component is Defined**
- Is it inside another component? → **Move it outside**
- Is it in a separate file? → **Already good**

### **Step 3: Wrap with React.memo**
```typescript
const MyInput = React.memo(({ value, onChange }) => {
  console.log("MyInput rendering"); // Should only see this when props actually change
  return <input value={value} onChange={onChange} />;
});
```

### **Step 4: Memoize Event Handlers**
```typescript
const handleChange = React.useCallback((e) => {
  onChange(e.target.value);
}, [onChange]);
```

### **Step 5: Test**
- Type multiple characters quickly
- Focus should stay in input ✅

---

## ⚡ **Quick Copy-Paste Templates**

### **Template 1: Basic Input**
```typescript
const BasicInput = React.memo(({ value, onChange, placeholder }) => {
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);
  
  return <input value={value} onChange={handleChange} placeholder={placeholder} />;
});

BasicInput.displayName = "BasicInput";
```

### **Template 2: Labeled Input**
```typescript
const LabeledInput = React.memo(({ label, value, onChange, ...props }) => {
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);
  
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-medium">{label}</label>}
      <input value={value} onChange={handleChange} {...props} />
    </div>
  );
});

LabeledInput.displayName = "LabeledInput";
```

### **Template 3: Textarea**
```typescript
const TextArea = React.memo(({ value, onChange, ...props }) => {
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);
  
  return <textarea value={value} onChange={handleChange} {...props} />;
});

TextArea.displayName = "TextArea";
```

---

## 🎓 **Remember**

1. **Component location matters** - Define OUTSIDE parent
2. **React.memo for stability** - Prevents unnecessary recreation
3. **useCallback for handlers** - Stable function references
4. **useMemo for derived data** - Avoid recalculating
5. **Stable keys** - Don't use random keys or index in dynamic lists

---

## 📞 **Still Having Issues?**

Check these:
- [ ] Component defined outside parent?
- [ ] Wrapped with React.memo?
- [ ] Event handlers use useCallback?
- [ ] Keys are stable (not random)?
- [ ] No inline object/array props?
- [ ] Button type="button" (not submit)?
- [ ] preventDefault() on button clicks?

---

**If all checked and still broken, the issue might be:**
- Parent component force re-mounting
- CSS causing layout shift
- Third-party library interference

---

*Quick Reference v1.0*  
*Date: October 29, 2025*  
*For: TRADIE Application Input Focus Issues*
