import React, { forwardRef, Suspense, useContext, useEffect, useId, useState } from "react";

import Heading from "@/components/heading/Heading";
import Input from "@/components/input/Input";
import InputRow from "@/components/input_row/InputRow";
import Form from "@/components/form/Form";
import Button from "@/components/button/Button";
import Select from "@/components/select/Select";
import styles from "./styles/formGenerator.module.css";
import FileInput from "@/components/fileInput/FileInput";
import Loader from "../loader/Loader";
import Search from "../search/Search";
import CheckBox from "../checkbox/Checkbox";
import { Context } from "@/store/store";
import MultiSelect from "../multiselect/MultiSelect";
import RadioGroup from "@/components/radioGroup/Radio";
import Toggle from "../toggle/Toggle";
import Settings from "../settings/settings";
import DataTable from "../DataTable/DataTable";
import TextArea from "../textarea";
import InputGroup from "../InputGroup";
import Label from "../label";
import CheckboxGroup from "../checkboxGroup/CheckboxGroup";
import { ResetFormData } from "@/utils/utll";

function FormGenerator({ formData, setFormData = () => {}, functions }, ref) {
  const { loading, setLoading } = useContext(Context);
  const [fetchControlCount, setFetchControlCount] = useState(0);
  const [fetchedControlCount, setFetchedControlCount] = useState(0);

  function isFetched(name) {
    setFetchedControlCount((prev) => prev++);
  }
  const uid = useId();
  useEffect(() => {
    setLoading(false);
    let count = getFetchControl();
    setFetchControlCount(count);

    () => {
      ResetFormData(setFormData);
    };
  }, []);

  useEffect(() => {
    if (fetchControlCount === fetchedControlCount) {
      functions?.handleFormLoad && functions?.handleFormLoad();
    }
  }, [fetchControlCount, fetchedControlCount]);

  if (loading) {
    return (
      <React.Fragment>
        {" "}
        <Loader />{" "}
      </React.Fragment>
    );
  }
  function getFetchControl() {
    let count = 0;
    formData.forms.forEach((form) => {
      form.forEach((subForm) => {
        subForm?.rows?.forEach((row) => {
          row.controls.forEach((control) => {
            if (control.visible && control.fetch) {
              count++;
            }
          });
        });
      });
    });

    return count;
  }
  return (
    <>
      {formData && (
        <div className={styles.container} key={`mainForm_${uid}`} ref={ref}>
          {formData?.screenTitle ? <Heading text={formData.screenTitle} key={`heading_${uid}`} /> : <></>}
          {formData.forms &&
            formData.forms.length > 0 &&
            formData.forms.map((form, frmIndex) => {
              const formKey = `form_${uid}_${frmIndex}`; // Generate a unique key for each form
              return (
                <React.Fragment key={formKey}>
                  {Array.isArray(form) &&
                    form?.map((formItem, formItemIndex) => {
                      const formItemKey = `sub_form${uid}`; // Generate a unique key for each form item
                      return (
                        <Form title={formItem.title} notes={formItem.note} key={`${formItemKey}_${formItemIndex}`}>
                          {formItem.rows &&
                            formItem.rows.length > 0 &&
                            formItem.rows.map((row, rowIndex) => {
                              const rowKey = `row_${rowIndex}_${uid}`; // Generate a unique key for each row
                              return (
                                <Suspense fallback={<Loader />} key={`Suspense${rowKey}`}>
                                  <InputRow key={rowKey} {...row}>
                                    {row.controls &&
                                      row.controls.map((control, controlIndex) => {
                                        const controlKey = `${formItemIndex}_${rowIndex}${controlIndex}_${control.name}_${uid}`; // Generate a unique key for each control
                                        return (
                                          <Suspense fallback={<Loader />} key={`suspance${controlKey}`}>
                                            {control.visible == true && (
                                              <React.Fragment key={`row_${controlKey}`}>
                                                {["input", "number", "email", "password", "date", "datetime"].includes(control.type) && (
                                                  <Input
                                                    {...control}
                                                    key={`input_${controlKey}`}
                                                    title={`${control.title}${control?.validation?.required ? "*" : ""}`}
                                                    onChange={(e) => {
                                                      functions[control.onChange]?.call(this, e, formItemIndex, null, frmIndex);
                                                    }}
                                                  />
                                                )}
                                                {control.type === "checkbox" && (
                                                  <CheckBox
                                                    key={`input_${controlKey}`}
                                                    {...control}
                                                    onChange={(e) => {
                                                      functions[control.onChange].call(this, e, formItemIndex, null, frmIndex);
                                                    }}
                                                  />
                                                )}
                                                {control.type === "file" && (
                                                  <FileInput
                                                    {...control}
                                                    key={`input_${controlKey}`}
                                                    isError={!control.isValid}
                                                    onChange={(e) => {
                                                      functions[control.onChange].call(this, e, formItemIndex, null, frmIndex);
                                                    }}
                                                  />
                                                )}
                                                {control.type === "textarea" && (
                                                  <TextArea
                                                    {...control}
                                                    key={`date_${controlKey}`}
                                                    title={`${control.title}${control?.validation?.required ? "*" : ""}`}
                                                    onChange={(e) => {
                                                      functions[control.onChange].call(this, e, formItemIndex, null, frmIndex);
                                                    }}
                                                  />
                                                )}

                                                {control.type === "select" && <Select {...control} disable={control.disabled} ddnField={control?.ddnFields} frmIndex={formItemIndex} key={`select_${controlKey}`} selectorText={control.selector} title={`${control.title}${control.validation?.required === true ? "*" : ""}`} filter={control?.filterOut} isFetched={isFetched} onChange={(e, index, dropdown) => functions[control.onChange].call(this, e, index, dropdown, frmIndex)} defaultSelected={control?.defaultSelected} />}

                                                {control.type === "multiselect" && <MultiSelect {...control} key={`select_${controlKey}`} frmIndex={formItemIndex} title={`${control.title}${control.validation?.required === true ? "*" : ""}`} isFetched={isFetched} onChange={(e, index, dropdown) => functions[control.onChange].call(this, e, index, dropdown, frmIndex)} />}

                                                {control.type === "radio" && (
                                                  <RadioGroup
                                                    {...control}
                                                    val={control.value}
                                                    key={`select_${controlKey}`}
                                                    frmIndex={formItemIndex}
                                                    title={`${control.title}${control.validation?.required === true ? "*" : ""}`}
                                                    onChange={(e) => {
                                                      functions[control.onChange].call(this, e, formItemIndex, null, frmIndex);
                                                    }}
                                                  />
                                                )}
                                                {control.type === "checkGroup" && (
                                                  <CheckboxGroup
                                                    {...control}
                                                    val={control.value}
                                                    key={`select_${controlKey}`}
                                                    frmIndex={formItemIndex}
                                                    title={`${control.title}${control.validation?.required === true ? "*" : ""}`}
                                                    onChange={(e) => {
                                                      functions[control.onChange].call(this, e, formItemIndex, null, frmIndex);
                                                    }}
                                                  />
                                                )}
                                                {control.type === "inputGroup" && (
                                                  <InputGroup
                                                    {...control}
                                                    onChange={(e) => {
                                                      functions[control.onChange].call(this, e, formItemIndex, null, frmIndex);
                                                    }}
                                                  />
                                                )}
                                                {control.type === "table" && <DataTable {...control} mainData={functions[control.data]} key={`table_${controlKey}`} frmIndex={formItemIndex} />}
                                                {control.type === "setting" && <Settings {...control} onClick={functions[control.onClick]} />}
                                                {control.type === "button" && <Button {...control} key={controlKey} frmIndex={formItemIndex} onClick={functions[control.onClick]} />}
                                                {control.type === "search" && <Search {...control} key={controlKey} onChange={functions[control.onChange]} />}
                                                {control.type === "toggle" && (
                                                  <Toggle
                                                    key={`input_${controlKey}`}
                                                    {...control}
                                                    onChange={(e) => {
                                                      functions[control.onChange].call(this, e, formItemIndex);
                                                    }}
                                                  />
                                                )}
                                                {control.type === "label" && <Label {...control} key={`input_${controlKey}`} frmIndex={formItemIndex} value={functions[control.value]} />}
                                              </React.Fragment>
                                            )}
                                          </Suspense>
                                        );
                                      })}
                                  </InputRow>
                                </Suspense>
                              );
                            })}
                        </Form>
                      );
                    })}
                </React.Fragment>
              );
            })}
        </div>
      )}
    </>
  );
}

export default forwardRef(FormGenerator);
