import { UseFormReturnType } from "@mantine/form";
import { FormDigest } from "../../types";
import {
  Stack,
  Title,
  Switch,
  Divider,
  Select,
  Box,
  InputLabel,
  Chip,
  Group,
  Input,
  Text,
} from "@mantine/core";
import { DigestFrequency } from "@sweetr/graphql-types/api";
import { IconClock, IconInfoCircle, IconWorld } from "@tabler/icons-react";
import { BoxSetting } from "../../../../../../../components/box-setting";
import { SelectHour } from "../../../../../../../components/select-hour";
import { SelectTimezone } from "../../../../../../../components/select-timezone/select-timezone";
import { DayOfTheWeek } from "@sweetr/graphql-types/frontend/graphql";
import { useEffect, useRef } from "react";

interface DigestBaseFieldsProps {
  form: UseFormReturnType<FormDigest>;
}

export const DigestBaseFields = ({ form }: DigestBaseFieldsProps) => {
  const isEnabled = form.values.enabled;

  const channelRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEnabled && !form.values.channel) {
      channelRef.current?.focus();
    }
  }, [isEnabled, form.values.channel]);

  return (
    <>
      <Stack p="md">
        <Title order={5}>Settings</Title>

        <BoxSetting label="Enabled">
          <Switch
            size="lg"
            color="green.7"
            onLabel="ON"
            offLabel="OFF"
            {...form.getInputProps("enabled", { type: "checkbox" })}
          />
        </BoxSetting>

        {isEnabled && (
          <>
            <Input.Wrapper>
              <Input.Label required>Channel</Input.Label>
              <Group align="top">
                <Stack gap="5px" flex="1">
                  <Input
                    ref={channelRef}
                    leftSection={<>#</>}
                    flex="1"
                    {...form.getInputProps("channel")}
                  />
                  {form.getInputProps("channel").error && (
                    <Input.Error>
                      {form.getInputProps("channel").error}
                    </Input.Error>
                  )}
                </Stack>
              </Group>
            </Input.Wrapper>
          </>
        )}
        <Group gap={5}>
          <IconInfoCircle size={16} stroke={1.5} />
          <Text c="dimmed" size="xs">
            Tip: Sweetr is only able to auto join public channels. You must
            manually invite @Sweetr to private channels.
          </Text>
        </Group>
      </Stack>

      {isEnabled && (
        <>
          <Divider my="md" />

          <Stack p="md" pb="xl">
            <Title order={5}>Schedule</Title>

            <Select
              required
              label="Frequency"
              data={[
                { value: DigestFrequency.WEEKLY, label: "Every week" },
                {
                  value: DigestFrequency.MONTHLY,
                  label: `First of the month`,
                },
              ]}
              value={form.values.frequency}
              onChange={(value) => {
                form.setFieldValue("frequency", value as DigestFrequency);

                if (
                  value === DigestFrequency.MONTHLY &&
                  form.values.dayOfTheWeek.length > 1
                ) {
                  form.setFieldValue(
                    "dayOfTheWeek",
                    form.values.dayOfTheWeek.slice(-1),
                  );
                }
              }}
            />
            <Box>
              <InputLabel required>Day of the week</InputLabel>
              <Chip.Group
                value={form.values.dayOfTheWeek}
                onChange={(value) => {
                  if (form.values.frequency === DigestFrequency.WEEKLY) {
                    form.setFieldValue("dayOfTheWeek", value as DayOfTheWeek[]);
                  } else if (value) {
                    form.setFieldValue("dayOfTheWeek", [
                      (value as string[]).pop() as DayOfTheWeek,
                    ]);
                  }
                }}
                multiple={form.values.frequency === DigestFrequency.WEEKLY}
              >
                <Group>
                  <Chip value={`${DayOfTheWeek.MONDAY}`} size="xs">
                    Monday
                  </Chip>
                  <Chip value={`${DayOfTheWeek.TUESDAY}`} size="xs">
                    Tuesday
                  </Chip>
                  <Chip value={`${DayOfTheWeek.WEDNESDAY}`} size="xs">
                    Wednesday
                  </Chip>
                  <Chip value={`${DayOfTheWeek.THURSDAY}`} size="xs">
                    Thursday
                  </Chip>
                  <Chip value={`${DayOfTheWeek.FRIDAY}`} size="xs">
                    Friday
                  </Chip>
                  <Chip value={`${DayOfTheWeek.SATURDAY}`} size="xs">
                    Saturday
                  </Chip>
                  <Chip value={`${DayOfTheWeek.SUNDAY}`} size="xs">
                    Sunday
                  </Chip>
                </Group>
              </Chip.Group>
            </Box>
            <Group grow>
              <SelectHour
                required
                {...form.getInputProps("timeOfDay")}
                label="Time"
                leftSection={<IconClock size={16} stroke={1.5} />}
              />
              <SelectTimezone
                required
                {...form.getInputProps("timezone", { type: "input" })}
                label="Timezone"
                leftSection={<IconWorld size={16} stroke={1.5} />}
              />
            </Group>
          </Stack>
        </>
      )}
    </>
  );
};
