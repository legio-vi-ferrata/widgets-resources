import { StructurePreviewProps, hideNestedPropertiesIn, Problem, Properties } from "@mendix/piw-utils-internal";

import barChartGroupedSvgDark from "./assets/BarChart.Grouped.dark.svg";
import barChartGroupedSvgLight from "./assets/BarChart.Grouped.light.svg";
import barChartStackedSvgDark from "./assets/BarChart.Stacked.dark.svg";
import barChartStackedSvgLight from "./assets/BarChart.Stacked.light.svg";

import { BarChartPreviewProps } from "../typings/BarChartProps";

export function getPreview(values: BarChartPreviewProps, isDarkMode: boolean): StructurePreviewProps {
    return {
        type: "Image",
        document: decodeURIComponent(
            (values.presentation === "grouped"
                ? isDarkMode
                    ? barChartGroupedSvgDark
                    : barChartGroupedSvgLight
                : isDarkMode
                ? barChartStackedSvgDark
                : barChartStackedSvgLight
            ).replace("data:image/svg+xml,", "")
        )
    };
}

export function getProperties(values: BarChartPreviewProps, defaultProperties: Properties): Properties {
    values.barSeries.forEach((series, index) => {
        if (series.dataSet === "static") {
            hideNestedPropertiesIn(defaultProperties, values, "barSeries", index, [
                "dynamicDataSource",
                "groupByAttribute",
                "dynamicSeriesName",
                "dynamicXAttribute",
                "dynamicYAttribute",
                "dynamicCustomBarStyle"
            ]);
        } else {
            hideNestedPropertiesIn(defaultProperties, values, "barSeries", index, [
                "staticDataSource",
                "staticSeriesName",
                "staticXAttribute",
                "staticYAttribute",
                "staticCustomBarStyle"
            ]);
        }
    });

    return defaultProperties;
}

export function check(values: BarChartPreviewProps): Problem[] {
    const errors: Problem[] = [];

    values.barSeries.forEach((series, index) => {
        if (series.dataSet === "static") {
            if (
                !series.staticDataSource ||
                ("type" in series.staticDataSource && series.staticDataSource.type === "null")
            ) {
                errors.push({
                    property: `barSeries/${index + 1}/staticDataSource`,
                    severity: "error",
                    message: `No data source configured for static series located at position ${index + 1}.`
                });
            }

            if (!series.staticXAttribute) {
                errors.push({
                    property: `barSeries/${index + 1}/staticXAttribute`,
                    severity: "error",
                    message: `No X attribute configured for static series located at position ${index + 1}.`
                });
            }

            if (!series.staticYAttribute) {
                errors.push({
                    property: `barSeries/${index + 1}/staticYAttribute`,
                    severity: "error",
                    message: `No Y attribute configured for static series located at position ${index + 1}.`
                });
            }
        } else {
            if (
                !series.dynamicDataSource ||
                ("type" in series.dynamicDataSource && series.dynamicDataSource.type === "null")
            ) {
                errors.push({
                    property: `barSeries/${index + 1}/dynamicDataSource`,
                    severity: "error",
                    message: `No data source configured for dynamic series located at position ${index + 1}.`
                });
            }

            if (!series.dynamicXAttribute) {
                errors.push({
                    property: `barSeries/${index + 1}/dynamicXAttribute`,
                    severity: "error",
                    message: `No X attribute configured for dynamic series located at position ${index + 1}.`
                });
            }

            if (!series.dynamicYAttribute) {
                errors.push({
                    property: `barSeries/${index + 1}/dynamicYAttribute`,
                    severity: "error",
                    message: `No Y attribute configured for dynamic series located at position ${index + 1}.`
                });
            }

            if (!series.groupByAttribute) {
                errors.push({
                    property: `barSeries/${index + 1}/groupByAttribute`,
                    severity: "error",
                    message: `No group by attribute configured for dynamic series located at position ${index + 1}.`
                });
            }
        }
    });

    return errors;
}
