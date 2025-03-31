import { exists, BaseDirectory, readTextFile, writeTextFile, mkdir } from '@tauri-apps/plugin-fs';

export interface UserSettings {
    workspacePath: string;
    theme: string;
    hideTutorial: boolean;
    defaultJournalColor: string;
    lastOpenedJournal: string;
}

const defaultSettings: UserSettings = {
    workspacePath: "~/Documents/rememberIt",
    theme: "light",
    hideTutorial: false,
    defaultJournalColor: "blue",
    lastOpenedJournal: "journal1"
};

let currentSettings: UserSettings;

export async function saveSettings(settings: UserSettings): Promise<void> {
    try {
        await writeTextFile('settings.json', JSON.stringify(settings, null, 4), {
            baseDir: BaseDirectory.AppData,
        });
        currentSettings = settings;
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
}

export async function initializeSettings(): Promise<UserSettings> {
    try {
        // First check if the directory exists
        const dirExists = await exists('', {
            baseDir: BaseDirectory.AppData
        });

        if (!dirExists) {
            // Create the directory if it doesn't exist
            await mkdir('', {
                baseDir: BaseDirectory.AppData,
                recursive: true
            });
        }

        // Now check for the settings file
        const settingsExists = await exists('settings.json', {
            baseDir: BaseDirectory.AppData,
        });

        if (!settingsExists) {
            // Write default settings if file doesn't exist
            await writeTextFile('settings.json', JSON.stringify(defaultSettings, null, 4), {
                baseDir: BaseDirectory.AppData,
            });
            currentSettings = defaultSettings;
        } else {
            // Read existing settings
            const contents = await readTextFile('settings.json', {
                baseDir: BaseDirectory.AppData,
            });
            currentSettings = JSON.parse(contents);
        }

        return currentSettings;
    } catch (error) {
        console.error('Error initializing settings:', error);
        // If anything fails, return default settings
        currentSettings = defaultSettings;
        return currentSettings;
    }
}

export function getSettings(): UserSettings {
    return currentSettings;
}


