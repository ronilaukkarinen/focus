import ApexCharts from 'apexcharts';

function getDateRanges() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const last7DaysStart = new Date(today);
  last7DaysStart.setDate(today.getDate() - 6);
  const last7DaysEnd = new Date();

  const last14DaysStart = new Date(today);
  last14DaysStart.setDate(today.getDate() - 13);
  const last14DaysEnd = new Date();

  const last30DaysStart = new Date(today);
  last30DaysStart.setDate(today.getDate() - 29);
  const last30DaysEnd = new Date();

  const last90DaysStart = new Date(today);
  last90DaysStart.setDate(today.getDate() - 89);
  const last90DaysEnd = new Date();

  const last180DaysStart = new Date(today);
  last180DaysStart.setDate(today.getDate() - 179);
  const last180DaysEnd = new Date();

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  const thisYearStart = new Date(today.getFullYear(), 0, 1);
  const thisYearEnd = new Date(today.getFullYear(), 11, 31);

  const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
  const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);

  const allTimeStart = new Date(1971, 0, 1);
  const allTimeEnd = new Date();

  return {
    Today: [today, today],
    Yesterday: [yesterday, yesterday],
    'Last 7 days': [last7DaysStart, last7DaysEnd],
    'Last 14 days': [last14DaysStart, last14DaysEnd],
    'Last 30 days': [last30DaysStart, last30DaysEnd],
    'Last 90 days': [last90DaysStart, last90DaysEnd],
    'Last 180 days': [last180DaysStart, last180DaysEnd],
    'This month': [thisMonthStart, thisMonthEnd],
    'Last month': [lastMonthStart, lastMonthEnd],
    'This year': [thisYearStart, thisYearEnd],
    'Last year': [lastYearStart, lastYearEnd],
    Everything: [allTimeStart, allTimeEnd],
  };
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function toHoursAndMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
}

function plotSummary(data) {
  console.log('plotSummary called with:', data.totals, data.tags[0]);
  console.log('Full data structure:', data);
  document.querySelector('#js-total-time').textContent = toHoursAndMinutes(
    Math.floor(data.totals.duration / 60000000000)
  );
  document.querySelector(
    '#js-top-tag-text'
  ).textContent = `${data.tags[0].name}`;
  document.querySelector(
    '#js-top-tag-hours'
  ).textContent = `(${toHoursAndMinutes(
    Math.floor(data.tags[0].duration / 60000000000)
  )})`;
  document.querySelector('#js-completed').textContent = data.totals.completed;
  document.querySelector('#js-abandoned').textContent = data.totals.abandoned;
}

function getChartOptions(seriesData, xaxisCategories, title, chartType = 'bar') {
  const seriesName = 'Focus time';
  
  return {
    series: [
      {
        name: seriesName,
        data: seriesData,
      },
    ],
    chart: {
      type: chartType,
      height: 400,
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: false },
      foreColor: '#aaa'
    },
    colors: ['#7effe1'],
    stroke: {
      curve: chartType === 'area' ? 'smooth' : 'straight',
      width: chartType === 'area' ? 3 : 0,
      lineCap: 'round'
    },
    fill: {
      type: 'gradient',
      opacity: 1,
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.1,
        gradientToColors: ['#7effe1'],
        inverseColors: false,
        opacityFrom: chartType === 'bar' ? 1 : 0.3,
        opacityTo: chartType === 'bar' ? 0.7 : 0,
        stops: [0, 100]
      }
    },
    grid: {
      show: true,
      borderColor: '#333'
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'Archivo, sans-serif'
      },
      y: {
        formatter: function(value) {
          return toHoursAndMinutes(value);
        }
      }
    },
    xaxis: {
      categories: xaxisCategories,
      labels: {
        style: {
          colors: '#aaa'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#aaa'
        }
      }
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '14px',
        fontWeight: 400,
        color: '#aaa',
        fontFamily: 'Archivo, sans-serif'
      },
      margin: 20,
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        columnWidth: '70%'
      }
    }
  };
}

function plotWeekday(data) {
  const weekdayData = [];
  const weekCategories = [];

  // Reorder weekdays to start with Monday instead of Sunday
  const reorderedWeekdays = [];
  const weekdayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Create a map for quick lookup
  const weekdayMap = {};
  data.weekday.forEach((item) => {
    weekdayMap[item.name] = item;
  });
  
  // Add weekdays in Monday-first order
  weekdayOrder.forEach((dayName) => {
    if (weekdayMap[dayName]) {
      weekdayData.push(Math.floor(weekdayMap[dayName].duration / 60000000000));
      weekCategories.push(dayName);
    }
  });

  const weekdayOptions = getChartOptions(
    weekdayData,
    weekCategories,
    'Weekday totals',
    'bar'
  );

  const weekdayChart = new ApexCharts(
    document.querySelector('#js-weekday-chart'),
    weekdayOptions
  );
  weekdayChart.render();
}

function plotMain(data) {
  console.log('plotMain called, data period:', data.daily?.length, 'days');
  const days =
    (new Date(data.end_time).getTime() - new Date(data.start_time).getTime()) /
    (1000 * 60 * 60 * 24);

  const mainData = [];
  const mainCategories = [];
  let chart = 'daily';

  if (days > 45) {
    chart = 'weekly';
  }

  if (days > 90) {
    chart = 'monthly';
  }

  if (days > 366) {
    chart = 'yearly';
  }

  console.log('Using chart type:', chart, 'with data:', data[chart]);

  data[chart].forEach((item) => {
    let label = item.name;
    if (chart === 'daily') {
      label = new Date(item.name).toLocaleDateString(navigator.language, {
        month: 'short',
        day: 'numeric',
      });
    }

    mainData.push(Math.floor(item.duration / 60000000000));
    mainCategories.push(label);
  });

  console.log('Main chart data:', mainData, 'categories:', mainCategories);

  const mainOptions = getChartOptions(
    mainData,
    mainCategories,
    `${toTitleCase(chart)} totals`,
    'bar'
  );

  console.log('Main chart options:', mainOptions);

  const mainChart = new ApexCharts(
    document.getElementById('js-main-chart'),
    mainOptions
  );
  mainChart.render().then(() => {
    console.log('Main chart rendered successfully');
  }).catch(err => {
    console.error('Main chart render error:', err);
  });
}

function plotHourly(data) {
  const hourlyData = [];
  const hourlyCategories = [];
  data.hourly.forEach((item) => {
    hourlyCategories.push(item.name);
    hourlyData.push(Math.floor(item.duration / 60000000000));
  });

  const hourlyOptions = getChartOptions(
    hourlyData,
    hourlyCategories,
    'Hourly totals',
    'area'
  );

  const hourlyChart = new ApexCharts(
    document.querySelector('#js-hourly-chart'),
    hourlyOptions
  );
  hourlyChart.render();
}

function plotTags(data) {
  console.log('plotTags called with:', data.tags);
  const tagsData = [];
  const tagsCategories = [];
  
  // Generate colors for pie chart (using variations of mint theme)
  const colors = [
    '#7effe1', '#5ce6ca', '#3cd3b3', '#1fb99c', '#12b06a',
    '#0fa159', '#0c8847', '#0a7138', '#085a2a', '#06421e'
  ];
  
  // Show top 5 tags only for the tags chart
  if (data.tags && data.tags.length > 0) {
    const topTags = data.tags.slice(0, 5); // Show top 5 only
    topTags.forEach((item) => {
      tagsCategories.push(item.name);
      tagsData.push(Math.floor(item.duration / 60000000000));
    });
  }

  console.log('Tags chart data (top 5):', tagsData, 'categories:', tagsCategories);
  console.log('Full data structure for debugging:', data);

  const tagOptions = {
    series: tagsData,
    chart: {
      height: 400,
      type: 'pie',
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: false },
      foreColor: '#aaa'
    },
    colors: colors.slice(0, tagsData.length),
    labels: tagsCategories,
    stroke: {
      show: false,
      width: 0
    },
    plotOptions: {
      pie: {
        donut: {
          size: '0%'
        },
        expandOnClick: false,
        size: 150
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '12px',
      fontFamily: 'Archivo, sans-serif',
      labels: {
        colors: '#777'
      },
      markers: {
        width: 6,
        height: 6,
        strokeWidth: 0,
        strokeColor: 'transparent',
        radius: 3
      }
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'Archivo, sans-serif'
      },
      y: {
        formatter: (value) => {
          return toHoursAndMinutes(value);
        },
      },
      fillSeriesColor: false
    },
  };

  const tagChart = new ApexCharts(
    document.querySelector('#js-tags-chart'),
    tagOptions
  );
  tagChart.render();
}

function plotTasks(data) {
  console.log('plotTasks called with data:', data);
  const tasksData = [];
  const tasksCategories = [];
  
  // Generate colors for pie chart (using variations of mint theme)
  const colors = [
    '#7effe1', '#5ce6ca', '#3cd3b3', '#1fb99c', '#12b06a',
    '#0fa159', '#0c8847', '#0a7138', '#085a2a', '#06421e'
  ];
  
  // Show remaining tags (6th onwards) or all tags if <= 5 total
  let taskSource = [];
  
  if (data.tags && data.tags.length > 0) {
    if (data.tags.length > 5) {
      // Show remaining tags starting from 6th position
      taskSource = data.tags.slice(5);
    } else {
      // If 5 or fewer tags, show all in tasks chart
      taskSource = data.tags;
    }
  }
  
  taskSource.forEach((item) => {
    tasksCategories.push(item.name);
    tasksData.push(Math.floor(item.duration / 60000000000));
  });

  console.log('Tasks chart data (remaining tags):', tasksData, 'categories:', tasksCategories);

  const taskOptions = {
    series: tasksData,
    chart: {
      height: 400,
      type: 'pie',
      background: 'transparent',
      toolbar: { show: false },
      animations: { enabled: false },
      foreColor: '#aaa'
    },
    colors: colors.slice(0, tasksData.length),
    labels: tasksCategories,
    stroke: {
      show: false,
      width: 0
    },
    plotOptions: {
      pie: {
        donut: {
          size: '0%'
        },
        expandOnClick: false,
        size: 150
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '12px',
      fontFamily: 'Archivo, sans-serif',
      labels: {
        colors: '#777'
      },
      markers: {
        width: 6,
        height: 6,
        strokeWidth: 0,
        strokeColor: 'transparent',
        radius: 3
      }
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'Archivo, sans-serif'
      },
      y: {
        formatter: (value) => {
          return toHoursAndMinutes(value);
        },
      },
      fillSeriesColor: false
    },
  };

  const taskChart = new ApexCharts(
    document.querySelector('#js-tasks-chart'),
    taskOptions
  );
  taskChart.render();
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const pickerEl = document.getElementById('datepicker');
    if (!pickerEl) {
      console.error('Datepicker element not found');
      return;
    }

    const startDate = new Date(pickerEl.dataset.start);
    const endDate = new Date(pickerEl.dataset.end);

    // Simple preset range selector
    const presetDates = getDateRanges();
    
    // Create dropdown to replace datepicker
    const selectEl = document.createElement('select');
    selectEl.id = 'daterange-select';
    selectEl.className = pickerEl.className || '';
    selectEl.style.cssText = pickerEl.style.cssText || '';
    
    // Add options for each preset
    Object.entries(presetDates).forEach(([label, [start, end]]) => {
      const option = document.createElement('option');
      option.value = `${formatDate(start)}_${formatDate(end)}`;
      option.textContent = label;
      
      // Set as selected if matches current range
      const currentStart = formatDate(startDate);
      const currentEnd = formatDate(endDate);
      if (formatDate(start) === currentStart && formatDate(end) === currentEnd) {
        option.selected = true;
      }
      
      selectEl.appendChild(option);
    });
    
    // Handle selection change
    selectEl.addEventListener('change', (e) => {
      const [start_time, end_time] = e.target.value.split('_');
      window.location.href = `${window.location.pathname}?start_time=${start_time}&end_time=${end_time}`;
    });
    
    // Replace the input with select
    if (pickerEl.parentNode) {
      pickerEl.parentNode.replaceChild(selectEl, pickerEl);
    }

    const body = document.getElementById('body');
    const data = JSON.parse(body.dataset.stats);
    
    console.log('Stats data:', data);
    console.log('ApexCharts available:', typeof ApexCharts);

    plotSummary(data);
    plotMain(data);
    plotTags(data);
    plotWeekday(data);
    plotTasks(data);
    plotHourly(data);
    
    console.log('Chart functions executed');
  } catch (err) {
    console.log('Error:', err);
  }
});
