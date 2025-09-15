## 1.7.5 (2025-09-11)

### Fixed
- Improve time parsing to support flexible formats like "1h30min", "1h 30m", "1h15min", "1h30m"

## 1.7.4 (2025-09-11)

### Fixed
- Fix text replication issue when resizing terminal window
- Fix task name coloring issues when text wraps by using MaxWidth and Render methods

### Changed
- Remove pagination heading "Flow timer setup (1/4)" from flow timer form
- Simplify description field title and placeholder text for better readability

## 1.7.3 (2025-09-11)

### Fixed
- Fix category dropdown filtering by updating huh library to v0.7.0 and using correct Filtering method

## 1.7.2 (2025-09-11)

### Fixed
- Fix "until" time display bug showing current time instead of estimated end time in flow mode
- Clear task description field automatically for new flow sessions

### Added
- Add type-ahead functionality to category dropdown - users can now type letters to filter categories

### Changed
- Add release process documentation to README

## 1.7.1 (2025-09-11)

### Changed  
- Implement form pagination for flow timer setup to improve usability in small terminals
- Update all headings and form titles to use sentence case formatting

### Fixed
- Remove task names from being saved as tags in flow mode
- Remove unused sessionHelperReadOnly function that was causing linter errors
- Change weekday chart to start with Monday instead of Sunday

## 1.7.0 (2025-09-09)

### Changed
- Fix "Top tag" label to correctly show "Top task" in statistics page
- Replace Inter font with Archivo for better text rendering and fix font loading issues
- Use Instrument Serif font for numbers and Archivo for text/charts for improved typography
- Improve statistics page styling with cleaner design, removed box shadows, and better hover effects
- Update color scheme for better contrast and readability in both light and dark modes
- Reduce pie chart sizes and improve layout consistency in statistics page
- Fix legend display and alignment issues for pie charts
- Add documentation for web UI build process in README

### Added
- Improved statistics
- Track tags in the pie chart
- Add support for pre-defined tags in configuration file via `pre_defined_tags` setting
- Add tag selection dropdown in flow timer when pre-defined tags are configured
- Allow special characters and spaces in pre-defined tags for better flexibility

## 1.6.0 (2025-09-08)

### Fixed
- Fix stats command not accepting port flag - added missing flag registration to stats command
- Fix stats page showing empty data - JavaScript bundle was missing and needed to be built with esbuild
- Fix spacing issue in stats page navigation by adding proper left padding to main navigation
- Fix datepicker input styling to match theme with proper colors and calendar icon visibility in dark mode
- Fix 'c' completion hotkey not properly saving completed sessions to stats database
- Add Inter SemiBold (600) font file to properly support semibold typography in stats page
- Fix completion view looping issue and timer continuing to run after task completion
- Remove terminal confetti animation that was causing display issues  
- Fix timer tick handler still updating elapsed time during celebration view

### Added
- Add dark mode support to stats page - automatically follows system preferences
- Charts now properly render in dark mode with appropriate themes
- Add 'c' hotkey to complete flow mode sessions manually - marks session as completed instead of abandoned
- Add HTTP confetti trigger support for external celebration effects (disabled by default)
- Add `confetti_enabled` config option for enabling external confetti via raycast-confetti-server
- Add next task prompt after completion - press Enter to start new task or q to quit instead of automatically exiting

### Changed
- Use semibold (font-weight: 600) instead of bold for better typography in stats page
- Replace tibetan_bell sound with new 14-second singing bowl audio for better flow timer experience
- Improve bell sound playback timing to ensure full sound duration is played at 50% and 100% milestones
- Simplify completion celebration view by removing "TASK COMPLETED!" text and adding tada emoji before "Finished"
- Improve task name wrapping in completion view for narrow terminals

## 1.5.2 (2025-09-07)

Bug fixes:

- Fix beep.Loop2 function call to handle two return values correctly
- Improve golangci-lint configuration for better development workflow  
- Add comprehensive linter fixes: errcheck, staticcheck, and unused code warnings
- Update development tooling documentation

## 1.5.1 (2025-09-07)

Bug fixes:

- Fix stats command to default to 7 days when no time period is specified instead of showing error
- Update installation instructions to point to ronilaukkarinen/focus fork instead of original repository

## 1.5.0 (2025-09-07)

Features and enhancements:

- Add flow timer mode (`--flow/-f`) that counts up instead of down for more flexible work sessions.
- Add task name prompting in flow mode to track what you're working on.
- Add estimated time prompting in flow mode (e.g., "25m", "1h30m").
- Enhanced display in flow mode showing task name, elapsed vs estimated time, and progress bar.
- Visual overtime indicator: elapsed time turns red when exceeding estimated time in flow mode.
- Add configurable flow timer bells (`flow_bell` config option, enabled by default).
- Add configurable flow bell sound (`flow_bell_sound` config option) with three options: bell, loud_bell, tibetan_bell.
- Include Tibetan singing bowl sound for peaceful flow timer notifications.
- Play bell sound at 50% and 100% of estimated time in flow mode.
- Send desktop notifications at flow timer milestones (halfway and completion).
- Flow mode integrates with existing notification settings and work sound configuration.
- Prevent keyboard shortcuts from interfering with form input during prompts.
- Fix the code to support flat config.yml structure
- Add `flow_default` configuration option to set flow timer mode as default
- Enhanced flow timer display: dimmed "Focus on your task" message with task name in neon green and "until" time
- Remove 📝 emoji from task name display in flow mode

Bug fixes:

- Fix timer stopping when pressing 's' to select ambient sounds by replacing huh form with custom sound selection interface.
- Fix users getting stuck in sound menu by adding Ctrl+C quit handling to custom sound selection.
- Fix users getting stuck in flow mode form by adding Ctrl+C quit handling to flow mode prompts.
- Fix timer freezing when selecting ambient sounds by properly clearing completed forms.
- Fix play/pause functionality resetting timer instead of resuming when ambient sounds are active.
- Fix flow timer bell sounds not playing at 50% and 100% milestones by using embedded alert sounds.
- Fix bell sound conflicts with ambient sounds by implementing proper sound sequencing and mixing.
- Fix ambient sound playback using correct beep.Loop function for infinite sound loops.
- Fix ambient sounds cutting off after one second by properly managing file lifecycle with fileStreamWrapper.
- Fix timer stopping when ambient sounds are playing by avoiding speaker suspend/resume conflicts.
- Fix play/pause speed-up issue where timer would jump ahead after multiple pause/resume cycles by properly tracking paused duration.
- Fix flow timer bell volume being too loud by removing unnecessary gain amplification.
- Add visual feedback with green highlighting for active state in play/pause and sound controls using neon green color.
- Improve sound selection UI with styled custom menu matching original form appearance.
- Add "off" option to ambient sound selection for easy sound disabling.

## 1.4.2 (2023-11-25)

Internal:

- Make stable releases for macOS more seamless (#25)

Bug fixes:

- Fix risk of data loss due to db migrations (#24)

## 1.4.1 (2023-11-23)

Internal:

- Add logging with slog.

Bug fixes:

- Fix countdown timer rendering in macOS default terminal (#21).
- Fix description of `--since` flag.
- Fix bug where the recorded session end time exceeds the actual elapsed time
  due to real and monotonic time differences. This made resuming an interrupted
  session behave weirdly (#22).

## 1.4.0 (2023-10-14)

Features and enhancements:

- Add new strict mode to prevent session resumption.
- Use zip format for Windows release archives.
- Add status reporting feature (`focus status`).
- Statistics are now displayed using a web server (`focus stats`)
- Running timers are persisted to the data store every minute.
- Improve notification sounds for work and break sessions (`--work-sound` and
  `--break-sound`).
- Add ability to start timers in the past (`focus --since`).
- Specifying session duration is more flexible.
- Timers can be reset on resumption (`focus resume --reset`).
- Ambient sound can be changed on session resumption (`focus resume --sound`).
- Improve session resumption table presentation.

## 1.3.0 (2022-02-21)

Features and enhancements:

- Notify user when exiting focus on reaching max sessions.
- Add `edit-config` command for editing the config file.
- Add `session_cmd` config option and `--session-cmd/-cmd` CLI options for
  executing arbitrary commands after each session.
- Add ability to track and resume different timers.
- Display session tag in output.
- You can now launch a new instance of `focus` without quitting an existing
  instance as long as the countdown isn't actively running.
- Change `focus stats --list` to `focus list`.
- Change `focus stats --delete` to `focus delete`.
- Change `focus stats --tag` to `focus edit-tag`.
- Add ability to choose light or dark theme in config file.
- Support several other time formats for stats filtering.

## 1.2.0 (2021-09-17)

Features and enhancements:

- Add ability to tag sessions.
- Make it possible to disable sound when resuming a session.

## 1.1.0 (2021-08-19)

Fixes and enhancements:

- Fix issue where timer would start on Windows despite using Ctrl-C.
- `focus resume` now supports the `--sound`, `--sound-on-break`, and
  `--disable-notification` flags.
- Make statistics output more compact.
- Fix timer not skipping to next work session after interrupting a break
  session.

## 1.0.1 (2021-08-09)

Enhancements:

- Session deletion is more reliable now.
- Notify user if interrupted session is not found instead of starting a new
  session straightaway.

## 1.0.0 (2021-08-08)

Initial release
