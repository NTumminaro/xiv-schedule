// XIV Schedule Tracker - Main App

class XIVTracker {
    constructor() {
        this.currentDay = this.getTodayName();
        this.currentView = 'schedule';
        this.completedTasks = this.loadCompletedTasks();
        this.hideCompleted = localStorage.getItem('xiv-hide-completed') === 'true';
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupDayTabs();
        this.setupControls();
        this.setupWeeklyTrackers();
        this.highlightToday();
        this.renderTasks();
        this.renderCurrency();
        this.startCountdown();
    }

    // Weekly reset countdown (Tuesday 4:00 AM EST = 9:00 AM UTC)
    startCountdown() {
        const updateCountdown = () => {
            const now = new Date();
            const nextReset = this.getNextReset();
            const diff = nextReset - now;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const countdownEl = document.getElementById('countdown');
            countdownEl.textContent = `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Add urgent class if less than 24 hours
            if (diff < 24 * 60 * 60 * 1000) {
                countdownEl.classList.add('urgent');
            } else {
                countdownEl.classList.remove('urgent');
            }
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    getNextReset() {
        const now = new Date();
        const reset = new Date(now);
        
        // Set to Tuesday 9:00 UTC (4:00 AM EST)
        reset.setUTCHours(9, 0, 0, 0);
        
        // Find next Tuesday
        const daysUntilTuesday = (2 - reset.getUTCDay() + 7) % 7;
        reset.setUTCDate(reset.getUTCDate() + daysUntilTuesday);
        
        // If we're past this week's reset, go to next week
        if (reset <= now) {
            reset.setUTCDate(reset.getUTCDate() + 7);
        }
        
        return reset;
    }

    // Update progress bars (daily and weekly)
    updateProgress() {
        const tasks = this.getTasksForDay(this.currentDay);
        
        // Split into daily and weekly
        const dailyTasks = tasks.filter(t => !this.isWeeklyTask(t));
        const weeklyTasks = tasks.filter(t => this.isWeeklyTask(t));
        
        // Daily progress
        const dailyCompleted = dailyTasks.filter(task => {
            const key = this.getTaskKey(task, task.day);
            return this.completedTasks[key];
        }).length;
        const dailyTotal = dailyTasks.length;
        const dailyPercent = dailyTotal > 0 ? Math.round((dailyCompleted / dailyTotal) * 100) : 0;
        
        document.getElementById('daily-progress-text').textContent = `${dailyCompleted}/${dailyTotal}`;
        const dailyFill = document.getElementById('daily-progress-fill');
        dailyFill.style.width = `${dailyPercent}%`;
        dailyFill.classList.toggle('complete', dailyPercent === 100 && dailyTotal > 0);
        
        // Weekly progress
        const weeklyCompleted = weeklyTasks.filter(task => {
            const key = this.getTaskKey(task, task.day);
            return this.completedTasks[key];
        }).length;
        const weeklyTotal = weeklyTasks.length;
        const weeklyPercent = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;
        
        document.getElementById('weekly-progress-text').textContent = `${weeklyCompleted}/${weeklyTotal}`;
        const weeklyFill = document.getElementById('weekly-progress-fill');
        weeklyFill.style.width = `${weeklyPercent}%`;
        weeklyFill.classList.toggle('complete', weeklyPercent === 100 && weeklyTotal > 0);
        
        // Celebrate if ALL tasks done
        if (dailyPercent === 100 && weeklyPercent === 100 && (dailyTotal + weeklyTotal) > 0) {
            this.celebrate();
        }
    }

    // Mini celebration when all tasks done
    celebrate() {
        // Only celebrate once per completion
        const celebrateKey = `celebrated-${this.currentDay}-${new Date().toDateString()}`;
        if (localStorage.getItem(celebrateKey)) return;
        localStorage.setItem(celebrateKey, 'true');
        
        this.createConfetti();
    }

    createConfetti() {
        // Gruvbox colors
        const colors = ['#fb4934', '#fabd2f', '#b8bb26', '#d3869b', '#fe8019', '#8ec07c'];
        const container = document.body;
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
                z-index: 9999;
            `;
            container.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }
    }

    // Get current day name
    getTodayName() {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date().getDay()];
    }

    // LocalStorage helpers
    loadCompletedTasks() {
        const saved = localStorage.getItem('xiv-completed-tasks');
        return saved ? JSON.parse(saved) : {};
    }

    saveCompletedTasks() {
        localStorage.setItem('xiv-completed-tasks', JSON.stringify(this.completedTasks));
    }

    // Weekly Trackers
    loadWeeklyData() {
        const saved = localStorage.getItem('xiv-weekly-trackers');
        const data = saved ? JSON.parse(saved) : {};
        
        // Check if we need to reset (past Tuesday reset)
        const lastReset = data.lastReset ? new Date(data.lastReset) : new Date(0);
        const now = new Date();
        
        // Get the most recent Tuesday 9:00 UTC
        const currentReset = new Date(now);
        currentReset.setUTCHours(9, 0, 0, 0);
        const daysSinceTuesday = (currentReset.getUTCDay() - 2 + 7) % 7;
        currentReset.setUTCDate(currentReset.getUTCDate() - daysSinceTuesday);
        
        // If current time is before 9:00 UTC on Tuesday, go back a week
        if (now < currentReset) {
            currentReset.setUTCDate(currentReset.getUTCDate() - 7);
        }
        
        // Reset if last reset was before current reset period
        if (lastReset < currentReset) {
            return this.getDefaultWeeklyData(currentReset);
        }
        
        return data;
    }

    getDefaultWeeklyData(resetDate) {
        return {
            lastReset: resetDate.toISOString(),
            tailsCount: 0,
            tailsBook: false,
            cactpot: false,
            arcadion: false,
            alliance: false,
            faux: false,
            customCount: 0,
            island: false,
            doman: false
        };
    }

    saveWeeklyData() {
        localStorage.setItem('xiv-weekly-trackers', JSON.stringify(this.weeklyData));
    }

    setupWeeklyTrackers() {
        this.weeklyData = this.loadWeeklyData();
        this.renderWeeklyTrackers();

        // Counter buttons (tails, custom deliveries)
        document.querySelectorAll('.tracker-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tracker = btn.dataset.tracker;
                const action = btn.dataset.action;
                const max = tracker === 'tails' ? 9 : 6;
                const key = tracker === 'tails' ? 'tailsCount' : 'customCount';
                
                if (action === 'inc' && this.weeklyData[key] < max) {
                    this.weeklyData[key]++;
                } else if (action === 'dec' && this.weeklyData[key] > 0) {
                    this.weeklyData[key]--;
                }
                this.saveWeeklyData();
                this.renderWeeklyTrackers();
            });
        });

        // Toggle buttons
        document.querySelectorAll('.tracker-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const tracker = btn.dataset.tracker;
                this.weeklyData[tracker] = !this.weeklyData[tracker];
                this.saveWeeklyData();
                this.renderWeeklyTrackers();
            });
        });
    }

    renderWeeklyTrackers() {
        // Tails count
        const tailsCount = document.getElementById('tails-count');
        if (tailsCount) {
            tailsCount.textContent = this.weeklyData.tailsCount;
            tailsCount.style.color = this.weeklyData.tailsCount >= 9 ? '#b8bb26' : '#8ec07c';
        }

        // Custom deliveries count
        const customCount = document.getElementById('custom-count');
        if (customCount) {
            customCount.textContent = this.weeklyData.customCount;
            customCount.style.color = this.weeklyData.customCount >= 6 ? '#b8bb26' : '#8ec07c';
        }

        // Tails book special handling
        const tailsBook = document.getElementById('tails-book');
        if (tailsBook) {
            tailsBook.classList.toggle('active', this.weeklyData.tailsBook);
            tailsBook.textContent = this.weeklyData.tailsBook ? '📗' : '📕';
        }

        // All toggle buttons
        document.querySelectorAll('.tracker-toggle').forEach(btn => {
            const tracker = btn.dataset.tracker;
            if (tracker && tracker !== 'tailsBook') {
                btn.classList.toggle('active', this.weeklyData[tracker]);
            }
        });
    }

    getTaskKey(task, day) {
        return `${day}-${task.order}-${task.task}`;
    }

    // Navigation between Schedule and Currency views
    setupNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
                document.getElementById(`${view}-view`).classList.add('active');
                
                this.currentView = view;
            });
        });
    }

    // Day tab switching
    setupDayTabs() {
        document.querySelectorAll('.day-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentDay = tab.dataset.day;
                this.renderTasks();
            });
        });

        // Set initial active tab to today
        const todayTab = document.querySelector(`.day-tab[data-day="${this.currentDay}"]`);
        if (todayTab) {
            todayTab.click();
        } else {
            // Fallback to Tuesday if somehow today isn't found
            document.querySelector('.day-tab[data-day="Tuesday"]').click();
        }
    }

    // Highlight today's tab
    highlightToday() {
        const todayTab = document.querySelector(`.day-tab[data-day="${this.getTodayName()}"]`);
        if (todayTab) {
            todayTab.classList.add('today');
        }
    }

    // Control buttons (reset, hide)
    setupControls() {
        // Hide completed toggle
        const hideBtn = document.getElementById('toggle-hide');
        this.updateHideButton();
        
        hideBtn.addEventListener('click', () => {
            this.hideCompleted = !this.hideCompleted;
            localStorage.setItem('xiv-hide-completed', this.hideCompleted);
            this.updateHideButton();
            this.renderTasks();
        });

        document.getElementById('clear-day').addEventListener('click', () => {
            if (confirm(`Reset all tasks for ${this.currentDay}?`)) {
                this.clearDayTasks();
            }
        });

        document.getElementById('clear-all').addEventListener('click', () => {
            if (confirm('Reset ALL completed tasks? This cannot be undone!')) {
                this.completedTasks = {};
                this.saveCompletedTasks();
                this.renderTasks();
            }
        });
    }

    updateHideButton() {
        const hideBtn = document.getElementById('toggle-hide');
        hideBtn.textContent = this.hideCompleted ? '👁️‍🗨️' : '👁️';
        hideBtn.classList.toggle('active', this.hideCompleted);
        hideBtn.title = this.hideCompleted ? 'Show Completed' : 'Hide Completed';
    }

    clearDayTasks() {
        const tasksToShow = this.getTasksForDay(this.currentDay);
        tasksToShow.forEach(task => {
            const key = this.getTaskKey(task, task.day);
            delete this.completedTasks[key];
        });
        // Also clear celebration flag
        localStorage.removeItem(`celebrated-${this.currentDay}-${new Date().toDateString()}`);
        this.saveCompletedTasks();
        this.renderTasks();
    }

    // Check if a task is weekly
    isWeeklyTask(task) {
        return task.notes && task.notes.includes('WEEKLY');
    }

    // Get the day order for comparison (Tuesday = 0, since that's reset day)
    getDayOrder(day) {
        const order = { 'Tuesday': 0, 'Wednesday': 1, 'Thursday': 2, 'Friday': 3, 'Saturday': 4, 'Sunday': 5, 'Monday': 6 };
        return order[day] ?? -1;
    }

    // Get tasks for a specific day
    getTasksForDay(day) {
        const currentDayOrder = this.getDayOrder(day);

        // Get daily tasks (non-weekly)
        const dailyTasks = TASKS.filter(t => t.day === 'EVERY DAY' && !this.isWeeklyTask(t));
        
        // Get this day's specific tasks (non-weekly)
        const todayTasks = TASKS.filter(t => t.day === day && !this.isWeeklyTask(t));
        
        // Get weekly tasks: show if it's their day OR if it's a later day and not completed
        const weeklyTasks = TASKS.filter(t => {
            if (!this.isWeeklyTask(t)) return false;
            if (t.day === 'EVERY DAY') return true; // Weekly dailies always show
            
            const taskDayOrder = this.getDayOrder(t.day);
            const key = this.getTaskKey(t, t.day);
            const isCompleted = this.completedTasks[key];
            
            // Show if: it's the task's day, OR it's a later day and not done yet
            return t.day === day || (taskDayOrder < currentDayOrder && !isCompleted);
        });

        // Combine: daily first, then today's tasks, then weeklies at the end
        const combined = [...dailyTasks, ...todayTasks];
        combined.sort((a, b) => a.order - b.order);
        
        // Add weeklies at the end, sorted by their original day then order
        weeklyTasks.sort((a, b) => {
            const dayDiff = this.getDayOrder(a.day) - this.getDayOrder(b.day);
            return dayDiff !== 0 ? dayDiff : a.order - b.order;
        });

        return [...combined, ...weeklyTasks];
    }

    // Render tasks for current day
    renderTasks() {
        const container = document.getElementById('tasks-container');
        const tasks = this.getTasksForDay(this.currentDay);

        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="emoji">🎉</div>
                    <p>No tasks for this day! Enjoy your free time.</p>
                </div>
            `;
            return;
        }

        // Filter out completed if hideCompleted is on
        const visibleTasks = this.hideCompleted 
            ? tasks.filter(task => !this.completedTasks[this.getTaskKey(task, task.day)])
            : tasks;

        if (visibleTasks.length === 0 && this.hideCompleted) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="emoji">✨</div>
                    <p>All done! Nice work.</p>
                </div>
            `;
            this.updateProgress();
            return;
        }

        container.innerHTML = visibleTasks.map(task => {
            const key = this.getTaskKey(task, task.day);
            const isCompleted = this.completedTasks[key];
            const typeIcon = TYPE_ICONS[task.type] || '📦';
            const isWeekly = this.isWeeklyTask(task);
            const isCarryOver = isWeekly && task.day !== 'EVERY DAY' && task.day !== this.currentDay;
            
            return `
                <div class="task-card ${isCompleted ? 'completed' : ''} ${isWeekly ? 'weekly' : ''} ${isCarryOver ? 'carry-over' : ''}" 
                     data-key="${key}" data-priority="${task.priority}">
                    <div class="task-checkbox"></div>
                    <span class="task-type" title="${task.type}">${typeIcon}</span>
                    <div class="task-content">
                        <div class="task-name" title="${task.task}">${task.task}</div>
                        <div class="task-meta">${task.location}${isCarryOver ? ' · from ' + task.day : (task.notes ? ' · ' + task.notes : '')}</div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers
        container.querySelectorAll('.task-card').forEach(card => {
            card.addEventListener('click', () => {
                const key = card.dataset.key;
                const wasCompleted = this.completedTasks[key];
                this.toggleTask(key);
                
                // If hiding completed and we just completed a task, re-render to hide it
                if (this.hideCompleted && !wasCompleted) {
                    this.renderTasks();
                } else {
                    card.classList.toggle('completed');
                }
            });
        });

        this.updateProgress();
    }

    // Map task names to tracker keys
    getTaskTrackerMapping() {
        return {
            'Jumbo Cactpot - BUY TICKET': 'cactpot',
            'Wondrous Tails - Grab book from Khloe': 'tailsBook',
            'Arcadion Normal (all 4 bosses)': 'arcadion',
            'Alliance Raid - Echoes of Vana\'diel': 'alliance',
            'Faux Hollows - 3 attempts': 'faux',
            'Island Sanctuary weekly collection': 'island',
            'Doman Enclave donation': 'doman',
            'Doman Enclave - LAST CHANCE': 'doman'
        };
    }

    toggleTask(key) {
        const isCompleting = !this.completedTasks[key];
        
        if (isCompleting) {
            this.completedTasks[key] = Date.now();
        } else {
            delete this.completedTasks[key];
        }
        
        // Sync with weekly trackers
        const taskName = key.split('-').slice(2).join('-'); // Extract task name from key
        const mapping = this.getTaskTrackerMapping();
        
        // Find matching tracker
        for (const [taskMatch, trackerKey] of Object.entries(mapping)) {
            if (taskName.includes(taskMatch) || key.includes(taskMatch)) {
                this.weeklyData[trackerKey] = isCompleting;
                this.saveWeeklyData();
                this.renderWeeklyTrackers();
                break;
            }
        }
        
        this.saveCompletedTasks();
        this.updateProgress();
    }

    // Get grouped currency data
    getCurrencyGroups() {
        const grouped = {};
        CURRENCY.forEach(item => {
            if (!grouped[item.currency]) {
                grouped[item.currency] = {
                    name: item.currency,
                    cap: item.cap,
                    items: []
                };
            }
            grouped[item.currency].items.push(item);
        });
        return Object.values(grouped);
    }

    // Render currency list (left panel)
    renderCurrency() {
        const listContainer = document.getElementById('currency-list');
        const groups = this.getCurrencyGroups();

        listContainer.innerHTML = groups.map((group, index) => {
            const icon = CURRENCY_ICONS[group.name] || '💰';
            return `
                <div class="currency-list-item" data-index="${index}">
                    <span class="currency-icon">${icon}</span>
                    <div class="currency-info">
                        <div class="currency-name">${group.name}</div>
                        <div class="currency-cap">Cap: ${group.cap}</div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers
        listContainer.querySelectorAll('.currency-list-item').forEach(item => {
            item.addEventListener('click', () => {
                // Update active state
                listContainer.querySelectorAll('.currency-list-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Show detail
                const index = parseInt(item.dataset.index);
                this.renderCurrencyDetail(groups[index]);
            });
        });

        // Auto-select first item
        const firstItem = listContainer.querySelector('.currency-list-item');
        if (firstItem) {
            firstItem.click();
        }
    }

    // Render currency detail (right panel)
    renderCurrencyDetail(group) {
        const detailContainer = document.getElementById('currency-detail');
        const icon = CURRENCY_ICONS[group.name] || '💰';

        detailContainer.innerHTML = `
            <div class="detail-header">
                <div class="currency-title">
                    <span>${icon}</span>
                    ${group.name}
                </div>
                <div class="currency-cap-info">Cap: ${group.cap}</div>
            </div>
            <div class="detail-items">
                ${group.items.map(item => `
                    <div class="currency-item">
                        <div class="item-info">
                            <div class="item-buy">${item.what_to_buy}</div>
                            <div class="item-notes">${item.notes}</div>
                        </div>
                        <span class="item-priority ${item.priority}">${item.priority === 'SPEND' ? 'SPEND FREELY' : item.priority}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new XIVTracker();
});
