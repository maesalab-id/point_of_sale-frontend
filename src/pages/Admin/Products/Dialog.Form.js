import { Classes, FormGroup, InputGroup } from "@blueprintjs/core";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { DialogAdd as CategoryDialogAdd } from "../Categories/Dialog.Add";
import { FetchAndSelect, State, useClient } from "components";
import { toaster } from "components/toaster";

export const DialogForm = () => {
  const client = useClient();
  const { values, errors, handleChange, setFieldValue } = useFormikContext();
  const { t } = useTranslation("products-page");
  return (
    <>
      <h6 className={Classes.HEADING}>{t("dialog_form.title_1")}</h6>
      <FormGroup
        label={t("dialog_form.code.label")}
        labelFor="f-code"
        helperText={errors["code"]}
        intent={"danger"}
      >
        <InputGroup
          id="f-code"
          name="code"
          value={values["code"]}
          onChange={handleChange}
          intent={errors["code"] ? "danger" : "none"}
        />
      </FormGroup>
      <FormGroup
        label={t("dialog_form.name.label")}
        labelFor="f-name"
        helperText={errors["name"]}
        intent={"danger"}
      >
        <InputGroup
          id="f-name"
          name="name"
          value={values["name"]}
          onChange={handleChange}
          intent={errors["name"] ? "danger" : "none"}
        />
      </FormGroup>
      <FormGroup
        label={t("dialog_form.price.label")}
        labelFor="f-price"
        helperText={errors["price"]}
        intent={"danger"}
      >
        <InputGroup
          id="f-price"
          name="price"
          value={values["price"]}
          onChange={handleChange}
          intent={errors["price"] ? "danger" : "none"}
        />
      </FormGroup>
      <State
        initialValue={{
          isOpen: false,
          query: "",
        }}
      >
        {([state, setState]) => (
          <>
            <FormGroup
              label={t("dialog_form.category.label")}
              labelFor="f-category_id"
              helperText={errors["category_id"]}
              intent={"danger"}
            >
              <FetchAndSelect
                allowCreateItem={true}
                service={client["categories"]}
                id="f-category_id"
                name="category_id"
                value={values["category_id"]}
                intent={errors["category_id"] ? "danger" : "none"}
                onChange={async ({ value }) => {
                  await setFieldValue("category_id", value);
                }}
                onCreateNew={(query) => {
                  setState({
                    isOpen: true,
                    query,
                  });
                }}
                onPreFetch={(q, query) => {
                  return {
                    ...query,
                    name: q
                      ? {
                          $iLike: `%${q}%`,
                        }
                      : undefined,
                    $select: ["id", "name"],
                  };
                }}
                onFetched={(items) => {
                  return items.map((item) => {
                    return {
                      label: item["name"],
                      value: `${item["id"]}`,
                    };
                  });
                }}
              />
            </FormGroup>
            <CategoryDialogAdd
              isOpen={state.isOpen}
              initialValue={{
                name: state.query,
              }}
              onClose={() => {
                setState((s) => ({ ...s, isOpen: false }));
              }}
              onSubmitted={() => {
                toaster.show({
                  intent: "success",
                  message: "Category created",
                });
              }}
            />
          </>
        )}
      </State>
    </>
  );
};
