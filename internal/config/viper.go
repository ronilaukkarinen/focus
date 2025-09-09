package config

import (
	"errors"
	"fmt"
	"os"

	"github.com/spf13/viper"
)

// viperKeys defines the mapping between config keys and their Viper counterparts.
const (
	keyWorkDuration         = "work_duration"
	keyWorkMessage          = "work_msg"
	keyWorkSound            = "work_sound"
	keyWorkColor            = "work_color"
	keyShortBreakDuration   = "short_break_duration"
	keyShortBreakMessage    = "short_break_msg"
	keyShortBreakSound      = "break_sound"
	keyShortBreakColor      = "short_break_color"
	keyLongBreakDuration    = "long_break_duration"
	keyLongBreakMessage     = "long_break_msg"
	keyLongBreakSound       = "break_sound"
	keyLongBreakColor       = "long_break_color"
	keyLongBreakInterval    = "long_break_interval"
	keyAutoStartWork        = "auto_start_work"
	keyAutoStartBreak       = "auto_start_break"
	keySoundOnBreak         = "sound_on_break"
	keyStrict               = "strict"
	keyNotificationsEnabled = "notify"
	keyAmbientSound         = "sound"
	keySessionCmd           = "session_cmd"
	keyTwentyFourHour       = "24hr_clock"
	keyFlowBell             = "flow_bell"
	keyFlowBellSound        = "flow_bell_sound"
	keyFlowDefault          = "flow_default"
	keyConfettiEnabled      = "confetti_enabled"
	keyDarkTheme            = "dark_theme"
	keyPreDefinedTags       = "pre_defined_tags"
)

// WithViperConfig returns an Option that loads configuration from Viper.
func WithViperConfig(configPath string) Option {
	return func(c *Config) error {
		v := viper.New()

		v.SetConfigFile(configPath)
		v.SetConfigType("yaml")

		setupViper(v, c)

		err := v.ReadInConfig()
		if err == nil {
			return loadViperConfig(v, c)
		}

		if !errors.Is(err, os.ErrNotExist) {
			return errReadConfig.Wrap(err)
		}

		if err := v.WriteConfig(); err != nil {
			return errWriteConfig.Wrap(err)
		}

		return loadViperConfig(v, c)
	}
}

// setupViper configures Viper with defaults and prompt values.
func setupViper(v *viper.Viper, c *Config) {
	// Set defaults
	v.SetDefault(keyWorkDuration, "25m")
	v.SetDefault(keyWorkMessage, "Focus on your task")
	v.SetDefault(keyWorkColor, "#B0DB43")
	v.SetDefault(keyWorkSound, "loud_bell")
	v.SetDefault(keyShortBreakDuration, "5m")
	v.SetDefault(keyShortBreakMessage, "Take a breather")
	v.SetDefault(keyShortBreakColor, "#12EAEA")
	v.SetDefault(keyShortBreakSound, "bell")
	v.SetDefault(keyLongBreakColor, "#C492B1")
	v.SetDefault(keyLongBreakMessage, "Take a long break")
	v.SetDefault(keyLongBreakDuration, "15m")
	v.SetDefault(keyLongBreakSound, "bell")
	v.SetDefault(keyLongBreakInterval, 4)
	v.SetDefault(keyAutoStartBreak, true)
	v.SetDefault(keyAutoStartWork, false)
	v.SetDefault(keyNotificationsEnabled, true)
	v.SetDefault(keySoundOnBreak, false)
	v.SetDefault(keyDarkTheme, true)
	v.SetDefault(keyStrict, false)
	v.SetDefault(keyFlowBell, true)
	v.SetDefault(keyFlowBellSound, "tibetan_bell")
	v.SetDefault(keyFlowDefault, true)
	v.SetDefault(keyConfettiEnabled, false)
	v.SetDefault(keyAmbientSound, "")
	v.SetDefault(keySessionCmd, "")

	if c.firstRun {
		v.SetDefault(
			keyWorkDuration,
			fmt.Sprintf("%dm", int(c.Work.Duration.Minutes())),
		)
		v.SetDefault(
			keyShortBreakDuration,
			fmt.Sprintf("%dm", int(c.ShortBreak.Duration.Minutes())),
		)

		v.SetDefault(
			keyLongBreakDuration,
			fmt.Sprintf("%dm", int(c.LongBreak.Duration.Minutes())),
		)

		if c.Settings.LongBreakInterval != 0 {
			v.SetDefault(keyLongBreakInterval, c.Settings.LongBreakInterval)
		}
	}
}

// loadViperConfig loads configuration from Viper into the Config struct.
func loadViperConfig(v *viper.Viper, c *Config) error {
	// Manually map flat config to nested structs
	c.Work.Duration = v.GetDuration(keyWorkDuration)
	c.Work.Message = v.GetString(keyWorkMessage)
	c.Work.Sound = v.GetString(keyWorkSound)
	c.Work.Color = v.GetString(keyWorkColor)
	
	c.ShortBreak.Duration = v.GetDuration(keyShortBreakDuration)
	c.ShortBreak.Message = v.GetString(keyShortBreakMessage)
	c.ShortBreak.Sound = v.GetString(keyShortBreakSound)
	c.ShortBreak.Color = v.GetString(keyShortBreakColor)
	
	c.LongBreak.Duration = v.GetDuration(keyLongBreakDuration)
	c.LongBreak.Message = v.GetString(keyLongBreakMessage)
	c.LongBreak.Sound = v.GetString(keyLongBreakSound)
	c.LongBreak.Color = v.GetString(keyLongBreakColor)
	
	c.Settings.LongBreakInterval = v.GetInt(keyLongBreakInterval)
	c.Settings.AutoStartWork = v.GetBool(keyAutoStartWork)
	c.Settings.AutoStartBreak = v.GetBool(keyAutoStartBreak)
	c.Settings.SoundOnBreak = v.GetBool(keySoundOnBreak)
	c.Settings.Strict = v.GetBool(keyStrict)
	c.Settings.AmbientSound = v.GetString(keyAmbientSound)
	c.Settings.Cmd = v.GetString(keySessionCmd)
	c.Settings.TwentyFourHour = v.GetBool(keyTwentyFourHour)
	c.Settings.FlowBell = v.GetBool(keyFlowBell)
	c.Settings.FlowBellSound = v.GetString(keyFlowBellSound)
	c.Settings.FlowDefault = v.GetBool(keyFlowDefault)
	c.Settings.ConfettiEnabled = v.GetBool(keyConfettiEnabled)
	c.Settings.PreDefinedTags = v.GetStringSlice(keyPreDefinedTags)
	
	c.Notifications.Enabled = v.GetBool(keyNotificationsEnabled)
	c.Display.DarkTheme = v.GetBool(keyDarkTheme)
	
	return nil
}
