"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, Wifi, AlertTriangle, Server, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface TraceResult {
  "IP Address": string
  Time: number
  Anomaly: boolean
}

export default function ResultsPage() {
  const [results, setResults] = useState<TraceResult[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const router = useRouter()
  const { theme } = useTheme()

  useEffect(() => {
    // Retrieve data from localStorage
    const storedResults = localStorage.getItem("analysisResults")

    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults)
        setResults(parsedResults)
      } catch (error) {
        console.error("Error parsing results:", error)
      }
    }

    setLoading(false)
  }, [])

  const handleBackClick = () => {
    router.push("/")
  }

  const toggleCardExpansion = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index)
  }

  const getAverageTime = () => {
    if (results.length === 0) return 0
    const sum = results.reduce((acc, result) => acc + result.Time, 0)
    return (sum / results.length).toFixed(2)
  }

  const getMaxTime = () => {
    if (results.length === 0) return 0
    return Math.max(...results.map((result) => result.Time)).toFixed(2)
  }

  const getAnomalyCount = () => {
    return results.filter((result) => result.Anomaly).length
  }

  const getChartData = () => {
    return results.map((result, index) => ({
      hop: index + 1,
      time: result.Time,
      ip: result["IP Address"],
    }))
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-80 w-full" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-6xl flex flex-col items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Results Found</CardTitle>
            <CardDescription>There are no traceroute results to display. Please run a new analysis.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleBackClick} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center mb-8">
        <Button variant="ghost" onClick={handleBackClick} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold">Traceroute Results</h1>
      </motion.div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-2xl font-bold">{getAverageTime()} ms</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Max Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Wifi className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-2xl font-bold">{getMaxTime()} ms</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Hops</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Server className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-2xl font-bold">{results.length}</span>
                  {getAnomalyCount() > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {getAnomalyCount()} {getAnomalyCount() === 1 ? "Anomaly" : "Anomalies"}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <TabsContent value="timeline" className="mt-0">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

            {results.map((result, index) => (
              <motion.div key={index} variants={itemVariants} className="mb-4 relative">
                <div className="flex">
                  <div className="flex-none relative z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        result.Anomaly
                          ? "bg-destructive text-destructive-foreground"
                          : result.Time > 20
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  <div className="ml-4 flex-grow">
                    <Card
                      className={`w-full overflow-hidden transition-all duration-300 ${
                        expandedCard === index ? "shadow-lg" : ""
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Hop {index + 1}</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCardExpansion(index)}
                            className="h-8 w-8 p-0"
                          >
                            {expandedCard === index ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <CardDescription>IP: {result["IP Address"]}</CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span
                              className={`font-medium ${result.Time > 20 ? "text-amber-600 dark:text-amber-400" : ""}`}
                            >
                              {result.Time.toFixed(2)} ms
                            </span>
                          </div>

                          {result.Anomaly && (
                            <Badge variant="destructive" className="flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Anomaly
                            </Badge>
                          )}
                        </div>
                      </CardContent>

                      {expandedCard === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardFooter className="border-t pt-4 flex flex-col items-start">
                            <div className="grid grid-cols-2 gap-4 w-full">
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Response Time</p>
                                <p className="font-medium">{result.Time.toFixed(2)} ms</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Status</p>
                                <p
                                  className={`font-medium ${result.Anomaly ? "text-destructive" : "text-green-600 dark:text-green-400"}`}
                                >
                                  {result.Anomaly ? "Anomaly Detected" : "Normal"}
                                </p>
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-4"
                              onClick={() =>
                                window.open(`https://who.is/whois-ip/ip-address/${result["IP Address"]}`, "_blank")
                              }
                            >
                              <ExternalLink className="h-3 w-3 mr-2" />
                              Lookup IP Info
                            </Button>
                          </CardFooter>
                        </motion.div>
                      )}
                    </Card>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="chart" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Response Time by Hop</CardTitle>
              <CardDescription>Visualization of response times across all hops</CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <div className="w-full h-[350px]">
                <ChartContainer
                  config={{
                    time: {
                      label: "Response Time (ms)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="w-full h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData()} margin={{ top: 5, right: 20, left: 10, bottom: 25 }}>
                      <XAxis dataKey="hop" label={{ value: "Hop Number", position: "bottom", offset: 0 }} />
                      <YAxis label={{ value: "Response Time (ms)", angle: -90, position: "left", offset: -5 }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-md shadow-md p-3">
                                <p className="font-medium">Hop {payload[0].payload.hop}</p>
                                <p className="text-sm text-muted-foreground">IP: {payload[0].payload.ip}</p>
                                <p className="text-sm font-medium">Time: {payload[0].value} ms</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="time"
                        stroke="var(--color-time)"
                        strokeWidth={2}
                        dot={{
                          fill: "var(--color-time)",
                          r: 4,
                        }}
                        activeDot={{
                          r: 6,
                          stroke: theme === "dark" ? "#000" : "#fff",
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
              <CardDescription>Complete traceroute data in tabular format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Hop</th>
                      <th className="text-left py-3 px-4">IP Address</th>
                      <th className="text-left py-3 px-4">Response Time</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b ${
                          result.Anomaly
                            ? "bg-destructive/10"
                            : result.Time > 20
                              ? "bg-amber-50 dark:bg-amber-950/30"
                              : ""
                        }`}
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4 font-mono text-sm">{result["IP Address"]}</td>
                        <td className="py-3 px-4">
                          <span className={`${result.Time > 20 ? "text-amber-600 dark:text-amber-400" : ""}`}>
                            {result.Time.toFixed(2)} ms
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {result.Anomaly ? (
                            <Badge variant="destructive" className="flex items-center w-fit">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Anomaly
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800 w-fit"
                            >
                              Normal
                            </Badge>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

