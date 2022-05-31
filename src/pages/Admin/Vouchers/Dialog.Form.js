import { Classes, FormGroup, InputGroup, Tag } from "@blueprintjs/core";
import { DateRangeInput } from "@blueprintjs/datetime";
import { useFormikContext } from "formik";
import moment from "moment";
import { useTranslation } from "react-i18next";
import _get from "lodash.get";

export const DialogForm = () => {
  const { handleChange, values, errors, setFieldValue } = useFormikContext();
  const { t } = useTranslation("vouchers-page");
  return (
    <div className={Classes.DIALOG_BODY}>
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
        label={t("dialog_form.discount.label")}
        labelFor="f-value"
        helperText={errors["value"]}
        intent={"danger"}
      >
        <InputGroup
          id="f-value"
          name="value"
          value={values["value"]}
          onChange={handleChange}
          intent={errors["value"] ? "danger" : "none"}
          rightElement={<Tag minimal={true}>%</Tag>}
        />
      </FormGroup>
      <FormGroup
        label={t("dialog_form.start_end.label")}
        labelFor="f-start_end"
        helperText={
          _get(errors, "start") || _get(errors, "end")
            ? t("dialog_form.start_end.error_message")
            : undefined
        }
        intent={"danger"}
      >
        <DateRangeInput
          id="f-start_end"
          name="start_end"
          startInputProps={{
            fill: true,
            leftElement: (
              <Tag minimal={true}>{t("dialog_form.start_end.start.label")}</Tag>
            ),
            intent: errors["start"] ? "danger" : "none",
          }}
          endInputProps={{
            fill: true,
            leftElement: (
              <Tag minimal={true}>{t("dialog_form.start_end.end.label")}</Tag>
            ),
            intent: errors["end"] ? "danger" : "none",
          }}
          formatDate={(date) => moment(date).format("DD/MM/YYYY")}
          onChange={async (value) => {
            let start = moment(value[0]).toDate();
            let end = moment(value[1]).toDate();
            await setFieldValue("start", start);
            await setFieldValue("end", end);
          }}
          parseDate={(str) => new Date(str)}
          value={[values["start"], values["end"]]}
        />
      </FormGroup>
    </div>
  );
};
