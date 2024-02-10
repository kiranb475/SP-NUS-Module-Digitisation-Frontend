const colors = [
    "#708090", // Slate Gray
    "#6699CC", // Dusty Blue
    "#556B2F", // Olive Green
    "#800020", // Burgundy
    "#008080", // Teal
    "#DAA520", // Muted Yellow
    "#E6E6FA", // Soft Lavender
    "#D2691E", // Rustic Orange
    "#87AE73", // Sage Green
    "#483C32", // Taupe
    "#E5D9C7", // Oatmeal
    "#6B8E23", // Olive Drab
    "#4B6584", // Dusty Indigo
    "#43606C", // Muted Teal
    "#9B7CA1", // Mauve
    "#633B29", // Wine Red
    "#C7E6F4", // Paul Aqua
    "#D6CECE", // Lilac
    "#FFE5BD", // Peach
    "#D3D3D3", // Grey Lavender
]

let count = -1

export function getColor() {

    if (count == colors.length - 1) {
        count = -1
    }
    count++
    return colors[count]
}
