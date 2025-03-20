const exerciseData = [
  {
    id: 'ex001',
    name: 'Barbell Bench Press',
    description: 'A compound exercise that targets the chest, shoulders, and triceps.',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'Strength',
    instructions: [
      'Lie on a flat bench with your feet planted firmly on the ground.',
      'Grip the barbell slightly wider than shoulder-width apart.',
      'Unrack the barbell and lower it to your mid-chest.',
      'Push the barbell back up to the starting position by extending your arms.',
      'Repeat for the desired number of repetitions.'
    ],
    tips: [
      'Keep your wrists straight and elbows at a 45-degree angle to your body.',
      'Maintain a natural arch in your lower back.',
      'Keep your shoulders pulled back and down throughout the movement.',
      'Breathe in during the downward phase and exhale during the upward phase.'
    ],
    image: null
  },
  {
    id: 'ex002',
    name: 'Pull-up',
    description: 'A bodyweight exercise that works the muscles of the upper back, arms and core.',
    muscleGroups: ['Back', 'Biceps', 'Shoulders'],
    equipment: 'Pull-up Bar',
    difficulty: 'Intermediate',
    type: 'Strength',
    instructions: [
      'Hang from a pull-up bar with hands slightly wider than shoulder-width apart, palms facing away from you.',
      'Engage your core and pull your shoulder blades down and back.',
      'Pull yourself upward until your chin clears the bar.',
      'Lower yourself with control back to the starting position.',
      'Repeat for the desired number of repetitions.'
    ],
    tips: [
      'Avoid swinging or using momentum to get yourself up.',
      'Focus on squeezing your back muscles during the movement.',
      'Try to maintain a slight curve in your lower back.',
      'If you cannnot perform a full pull-up, try assisted pull-ups using a band or machine.'
    ],
    image: null
  },
  {
    id: 'ex003',
    name: 'Bodyweight Squat',
    description: 'A fundamental compound movement that targets the quadriceps, hamstrings, and glutes.',
    muscleGroups: ['Legs', 'Glutes'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Strength',
    instructions: [
      'Stand with feet shoulder-width apart, toes pointing slightly outward.',
      'Brace your core and keep your chest up.',
      'Bend at the knees and hips, lowering your body as if sitting in a chair.',
      'Lower until thighs are parallel to the ground, or as low as you can with proper form.',
      'Push through your heels to return to the starting position.',
      'Repeat for the desired number of repetitions.'
    ],
    tips: [
      'Keep your knees in line with your toes, not collapsing inward.',
      'Maintain a neutral spine throughout the movement.',
      'Drive through your heels, not your toes.',
      'Go as deep as your mobility allows while maintaining proper form.'
    ],
    image: null
  },
  {
    id: 'ex004',
    name: 'Deadlift',
    description: 'A powerful compound exercise that targets the posterior chain, including the hamstrings, glutes, and back.',
    muscleGroups: ['Back', 'Legs', 'Glutes'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'Strength',
    instructions: [
      'Stand with feet hip-width apart, barbell over mid-foot.',
      'Bend at the hips and knees to grip the bar with hands just outside your legs.',
      'Keep your back flat, core braced, and chest up.',
      'Drive through the heels, keeping the barbell close to your body as you stand up.',
      'Return the weight to the floor with control by hinging at the hips and bending the knees.'
    ],
    tips: [
      'Think of the movement as pushing the floor away, not lifting with your back.',
      'Keep the bar in contact with your legs during the entire movement.',
      'Engage your lats by thinking of "protecting your armpits."',
      'Complete the movement by squeezing your glutes at the top position.'
    ],
    image: null
  },
  {
    id: 'ex005',
    name: 'Plank',
    description: 'A core stabilizing exercise that engages multiple muscle groups to maintain a rigid position.',
    muscleGroups: ['Abs', 'Shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Strength',
    instructions: [
      'Start in a push-up position, then bend your elbows 90 degrees to rest your weight on your forearms.',
      'Keep your body in a straight line from head to heels.',
      'Engage your core by pulling your belly button toward your spine.',
      'Hold the position for the prescribed time.',
      'Breathe normally throughout the exercise.'
    ],
    tips: [
      'Do not let your hips sag or pike up; keep them in line with your shoulders and ankles.',
      'Look at a spot on the floor just ahead of your hands to maintain a neutral neck position.',
      'Squeeze your glutes and quadriceps to help maintain proper form.',
      'Start with shorter holds and gradually increase the duration as you build strength.'
    ],
    image: null
  },
  {
    id: 'ex006',
    name: 'Dumbbell Shoulder Press',
    description: 'An upper-body exercise targeting the deltoid muscles of the shoulders along with the triceps.',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    type: 'Strength',
    instructions: [
      'Sit on a bench with back support or stand with feet shoulder-width apart.',
      'Hold dumbbells at shoulder height with palms facing forward.',
      'Press the weights upward until your arms are extended overhead.',
      'Lower the dumbbells back to shoulder level with control.',
      'Repeat for the desired number of repetitions.'
    ],
    tips: [
      'Avoid arching your lower back; engage your core throughout the movement.',
      'Do not lock out your elbows at the top of the movement.',
      'Keep your shoulders down and away from your ears.',
      'For a greater range of motion, try lowering the dumbbells slightly below shoulder level.'
    ],
    image: null
  },
  {
    id: 'ex007',
    name: 'Dumbbell Bicep Curl',
    description: 'An isolation exercise targeting the biceps muscles of the upper arm.',
    muscleGroups: ['Biceps'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    type: 'Strength',
    instructions: [
      'Stand with feet shoulder-width apart, holding a dumbbell in each hand with arms extended and palms facing inward.',
      'Keeping your upper arms stationary, exhale as you curl the weights up while rotating your forearms.',
      'Continue curling until the dumbbells are at shoulder level with palms facing your shoulders.',
      'Hold the contracted position for a brief pause, then inhale as you slowly lower the weights back to starting position.',
      'Repeat for the desired number of repetitions.'
    ],
    tips: [
      'Keep your elbows close to your torso and your wrists straight throughout the movement.',
      'Avoid swinging the weights or using momentum; maintain controlled movements.',
      'Focus on fully contracting your biceps at the top of the movement.',
      'Lower the weights slowly to increase time under tension.'
    ],
    image: null
  },
  {
    id: 'ex008',
    name: 'Tricep Dips',
    description: 'A compound upper body exercise targeting the triceps, shoulders, and chest.',
    muscleGroups: ['Triceps', 'Shoulders', 'Chest'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Strength',
    instructions: [
      'Sit on the edge of a stable bench or chair with hands gripping the edge next to your hips.',
      'Slide your butt off the front of the bench with legs extended or slightly bent.',
      'Straighten your arms, keeping a slight bend in your elbows to maintain tension on your triceps.',
      'Slowly bend your elbows to lower your body until your angle is at about 90 degrees.',
      'Press down into the bench to straighten your arms and return to starting position.',
      'Repeat for the desired number of repetitions.'
    ],
    tips: [
      'Keep your shoulders down and away from your ears to avoid stress on your shoulder joints.',
      'Stay close to the bench throughout the movement.',
      'For a greater challenge, elevate your feet or extend your legs fully.',
      'For an easier version, keep your feet flat on the floor with knees bent at 90 degrees.'
    ],
    image: null
  },
  {
    id: 'ex009',
    name: 'Jumping Jacks',
    description: 'A full body cardio exercise that elevates heart rate and improves coordination.',
    muscleGroups: ['Full Body'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Cardio',
    instructions: [
      'Begin standing upright with your feet together and arms at your sides.',
      'Jump up, spreading your feet beyond shoulder width and bringing your arms above your head, nearly touching.',
      'Jump again, bringing your arms back to your sides and your feet together.',
      'Repeat at a quick tempo for the desired duration or number of repetitions.'
    ],
    tips: [
      'Land softly by bending slightly at the knees.',
      'Keep a steady rhythm for maximum cardiovascular benefit.',
      'For low-impact modification, step one leg out at a time instead of jumping.',
      'Focus on full range of motion with your arms to engage shoulders and increase heart rate.'
    ],
    image: null
  },
  {
    id: 'ex010',
    name: 'Mountain Climbers',
    description: 'A dynamic, full-body exercise that builds cardio endurance, core strength, and agility.',
    muscleGroups: ['Abs', 'Shoulders', 'Legs'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    type: 'Cardio',
    instructions: [
      'Begin in a high plank position with your hands directly under your shoulders.',
      'Engage your core and ensure your body forms a straight line from head to heels.',
      'Drive one knee toward your chest while keeping the other leg extended.',
      'Quickly switch legs, driving the extended leg in while moving the other leg back.',
      'Continue alternating legs at a brisk pace, as if "climbing" a mountain.'
    ],
    tips: [
      'Keep your hips down and in line with your shoulders and ankles.',
      'Move at a controlled but quick pace to maximize cardiovascular benefit.',
      'Breathe rhythmically, exhaling as you drive each knee forward.',
      'To modify, slow down the pace or perform the movement on an incline surface like a bench or wall.'
    ],
    image: null
  }
];

export default exerciseData;
