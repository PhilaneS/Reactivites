import { Box, debounce, List, ListItemButton, TextField, Typography } from "@mui/material"
import { useMemo, useState } from "react";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form"
import type { LocationIQSuggestion } from "../../../lib/types";
import axios from "axios";

type Props<T extends FieldValues> = {
    label: string
} & UseControllerProps<T>

const locationUrl = 'https://api.locationiq.com/v1/autocomplete?key=pk.374fb20f0b3b0bec23e676aee10b7bb8&limit=5&dedupe=1&';

export default function LocationInput<T extends FieldValues>(props: Props<T>) {
    const { field, fieldState } = useController({ ...props });
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);

    const fetchSuggestions = useMemo(
        () => debounce(async (query: string) => {
            if (!query || query.length < 3) {
                setSuggestions([]);
                return;
            }
            setLoading(true);
            try {
                const res = await axios.get<LocationIQSuggestion[]>(`${locationUrl}q=${query}`);
                setSuggestions(res.data);
            } catch (error) {
                console.log(error);

            } finally {
                setLoading(false);
            }
        }, 500), []
    )

    const handleChange = (value: string) => {
        const currentLocation = typeof field.value === 'object' && field.value
            ? field.value
            : {};

        field.onChange({ ...currentLocation, venue: value });
        fetchSuggestions(value);
    }

    const handleSuggestionClick = (suggestion: LocationIQSuggestion) => {

        const city = suggestion.address?.city || suggestion.address?.town || suggestion.address?.village;
        const venue = suggestion.display_name;
        const latitude = Number(suggestion.lat);
        const longitude = Number(suggestion.lon);

        field.onChange({
            venue: venue,
            city: city ?? '',
            latitude: latitude,
            longitude: longitude,
        });
        setSuggestions([]);
    }

    const venue = typeof field.value === 'object' && field.value
        ? field.value.venue ?? ''
        : '';

    return (
        <Box sx={{ position: 'relative' }}>
            <TextField
                label={props.label}
                name={field.name}
                value={venue}
                onBlur={field.onBlur}
                inputRef={field.ref}
                onChange={e => handleChange(e.target.value)}
                fullWidth
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message ?? (loading ? 'Loading...' : undefined)}
            />
            {suggestions.length > 0 && (
                <List
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        boxShadow: 3,
                    }}
                >
                    {suggestions.map(suggestion => (
                        <ListItemButton
                            divider
                            key={suggestion.place_id}
                            onMouseDown={event => event.preventDefault()}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <Typography>{suggestion.display_name}</Typography>
                        </ListItemButton>
                    ))}
                </List>
            )}
        </Box>
    )
}