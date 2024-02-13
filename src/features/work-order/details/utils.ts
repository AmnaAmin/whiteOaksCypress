import { t } from 'i18next'

export const onChangeHeaderCheckbox = (controlledAssignedItems, e, formControl, isAdmin, setClrState) => {
  const { setValue, watch, setError, clearErrors } = formControl

  controlledAssignedItems.forEach((item, index) => {
    const checkBoxData = watch(`assignedItems.${index}`)
    // here it will check if user isAdmin & top checkbox of column is checked then it will
    // change %completion dropdoen value to 100% of all dropdowns of &completion
    if (isAdmin) {
      setValue(`assignedItems.${index}.completePercentage`, {
        value: 100,
        label: '100%',
      })
      setValue(`assignedItems.${index}.isCompleted`, e.currentTarget.checked)
    }

    // this check will execute for all users other than Admin upon clicking on checkbox
    // of line item's top checkbox
    if (
      !isAdmin &&
      e.target.checked &&
      (checkBoxData?.completePercentage === 0 ||
        checkBoxData?.completePercentage < 100 ||
        checkBoxData?.completePercentage.value < 100)
    ) {
      setError(`assignedItems.${index}.completePercentage`, {
        type: 'custom',
        message: t('PercentageCompletionMsg'),
      })
      setClrState(true)
    } else {
      setClrState(false)
      clearErrors(`assignedItems.${index}.completePercentage`)
      setValue(`assignedItems.${index}.isCompleted`, e.currentTarget.checked)
    }

    if (!e.target.checked) {
      setValue(`assignedItems.${index}.isVerified`, false)
    }
  })
}

export const onChangeCheckbox = (e, isAdmin, formControl, field, index) => {
  const { setValue, watch, setError, clearErrors } = formControl

  const checkBoxData = watch(`assignedItems.${index}` as any)

  // here it will check if user isAdmin & checkbox is checked then it will
  // change related line items checkbox's %completion dropdoen value to 100%
  if (isAdmin) {
    setValue(`assignedItems.${index}.completePercentage`, {
      value: 100,
      label: '100%',
    })
    setValue(`assignedItems.${index}.isCompleted`, e.currentTarget.checked)
  }

  if (!e.target.checked) {
    setValue(`assignedItems.${index}.isVerified`, false)
  }

  // this check will execute for all users other than Admin upon clicking on checkbox
  // of  individual line item's
  if (
    !isAdmin &&
    e.target.checked &&
    (checkBoxData?.completePercentage === 0 ||
      checkBoxData?.completePercentage < 100 ||
      checkBoxData?.completePercentage.value < 100)
  ) {
    setError(`assignedItems.${index}.completePercentage`, {
      type: 'custom',
      message: t('PercentageCompletionMsg'),
    })
  } else {
    clearErrors(`assignedItems.${index}.completePercentage`)
    field.onChange(e.currentTarget.checked)
  }
}
