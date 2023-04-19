import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
  // create our own state object for our inputs
  const [inputs, setInputs] = useState(initial);

  const initialValues = Object.values(initial).join();

  useEffect(() => {
    setInputs(initial);
    // prevent infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  // {
  // name: Zoe
  // description: 'nice shoes'
  // price: 1000
  // }
  function handleChange(e) {
    let { value, type, name } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
    }
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, null])
    );
    setInputs(blankState);
  }

  // return the things we want to surface from this custom hook
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
